/**
 * Launch an HTTPS Express server with webpack dev and hot middleware.
 *
 * After successful compilation, uploads modified files (written to disk) to Shopify.
 */

const argv = require('minimist')(process.argv.slice(2));
const figures = require('figures');
const chalk = require('chalk');
const express = require('express');
const fs = require('fs');
const path = require('path');
const https = require('https');
const webpack = require('webpack');
const ora = require('ora');
const consoleControl = require('console-control-strings');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const openBrowser = require('react-dev-utils/openBrowser');
const clearConsole = require('react-dev-utils/clearConsole');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const {event} = require('@shopify/slate-analytics');
const {sync} = require('@shopify/slate-sync');
const slateEnv = require('@shopify/slate-env');

const config = require('../../slate-tools.config');
const webpackConfig = require('../../tools/webpack/config/dev');
const setEnvironment = require('../../tools/webpack/set-slate-env');
const getChangedFiles = require('../../tools/webpack/get-changed-files');
const packageJson = require('../../package.json');

event('slate-tools:start:start', {version: packageJson.version, webpackConfig});

setEnvironment(argv.env);

clearConsole();
let spinner = ora(chalk.magenta(' Compiling...')).start();

const sslCert = fs.existsSync(config.paths.ssl.cert)
  ? fs.readFileSync(config.paths.ssl.cert)
  : fs.readFileSync(path.join(__dirname, '../../ssl/server.pem'));

const sslKey = fs.existsSync(config.paths.ssl.key)
  ? fs.readFileSync(config.paths.ssl.key)
  : fs.readFileSync(path.join(__dirname, '../../ssl/server.pem'));

const sslOptions = {
  key: sslKey,
  cert: sslCert,
};

const app = express();
const server = https.createServer(sslOptions, app);
const compiler = webpack(webpackConfig);

const shopifyUrl = `https://${slateEnv.getStoreValue()}`;
const previewUrl = `${shopifyUrl}?preview_theme_id=${slateEnv.getThemeIdValue()}`;

let isFirstCompilation = true;
let isFirstDeploy = true;

app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  next();
});

app.use(
  webpackDevMiddleware(compiler, {
    quiet: true,
    reload: true,
  }),
);

const hotMiddleware = webpackHotMiddleware(compiler);
app.use(hotMiddleware);

compiler.hooks.compile.tap('Slate Tools Start', () => {
  clearConsole();
  spinner = ora(chalk.magenta(' Compiling...')).start();
});

compiler.hooks.done.tap('Slate Tools Start', async (stats) => {
  spinner.stop();
  clearConsole();

  // webpack messages massaging and logging gracioulsy provided by create-react-app.
  const statsJson = stats.toJson({}, true);
  const time = statsJson.time / 1000;
  const messages = formatWebpackMessages(statsJson);

  if (messages.errors.length) {
    event('slate-tools:start:compile-errors', {
      errors: messages.errors,
      version: packageJson.version,
    });
    console.log(chalk.red('Failed to compile.\n'));
    console.log(config.paths.lib);
    messages.errors.forEach((message) => {
      console.log(`${message}\n`);
    });
    // If errors exist, only show errors.
    return;
  }

  if (messages.warnings.length) {
    event('slate-tools:start:compile-warnings', {
      duration: statsJson.time,
      warnings: messages.warnings,
      version: packageJson.version,
    });
    console.log(chalk.yellow('Compiled with warnings.\n'));
    messages.warnings.forEach((message) => {
      console.log(`${message}\n`);
    });
  }

  if (!messages.errors.length && !messages.warnings.length) {
    event('slate-tools:start:compile-success', {
      duration: statsJson.time,
      version: packageJson.version,
    });
    console.log(
      `${chalk.green(figures.tick)}  Compiled successfully in ${time}s!`,
    );
  }

  // files we'll upload
  const files = getChangedFiles(stats);

  // files.forEach(file => {
  //   console.log(`\t${file}`);
  // });
  // console.log('\n');

  const liquidFiles = files.filter((file) => path.extname(file) === '.liquid');

  if (isFirstCompilation && argv.skipFirstDeploy) {
    isFirstCompilation = false;
    openBrowser(previewUrl);

    event('slate-tools:start:skip-first-deploy', {
      version: packageJson.version,
    });

    console.log(
      `\n${chalk.blue(
        figures.info,
      )}  Skipping first deployment because --skipFirstDeploy flag`,
    );

    console.log(chalk.magenta('\nWatching for changes...'));
  }

  if (!liquidFiles.length) {
    console.log(chalk.magenta('\nWatching for changes...'));

    return hotMiddleware.publish({
      action: 'shopify_upload_finished',
    });
  }

  if (!argv.skipFirstDeploy && (!isFirstCompilation && argv.skipFirstDeploy)) {
    if (isFirstDeploy) {
      isFirstDeploy = false;
    }

    event('slate-tools:start:sync-start', {version: packageJson.version});

    sync(liquidFiles)
      .then(() => {
        event('slate-tools:start:sync-end', {version: packageJson.version});

        process.stdout.write(consoleControl.previousLine(4));
        process.stdout.write(consoleControl.eraseData());
        console.log(
          `\n${chalk.green(
            figures.tick,
          )}  Files uploaded successfully! Your theme is running at:\n`,
        );
        console.log(`      ${chalk.cyan(previewUrl)}`);

        console.log(chalk.magenta('\nWatching for changes...'));

        if (isFirstCompilation) {
          isFirstCompilation = false;
          openBrowser(previewUrl);
        }

        // Notify the HMR client that we finished uploading files to Shopify
        return hotMiddleware.publish({
          action: 'shopify_upload_finished',
          force: liquidFiles.length > 0,
        });
      })
      .catch((error) => {
        event('slate-tools:start:sync-error', {
          error,
          version: packageJson.version,
        });
        console.log(chalk.red(error));
      });
  }
});

server.listen(config.port);
