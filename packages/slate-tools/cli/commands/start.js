/**
 * Launch an HTTPS Express server with webpack dev and hot middleware.
 *
 * After successful compilation, uploads modified files (written to disk) to Shopify.
 */

const argv = require('minimist')(process.argv.slice(2));
const figures = require('figures');
const chalk = require('chalk');
const createHash = require('crypto').createHash;
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
const packageJson = require('../../package.json');

event('slate-tools:start:start', {version: packageJson.version, webpackConfig});

setEnvironment(argv.env);

clearConsole();
let spinner = ora(chalk.magenta(' Compiling...')).start();

const sslCert = fs.existsSync(config.paths.ssl.cert)
  ? fs.readFileSync(config.paths.ssl.cert)
  : fs.readFileSync(path.join(__dirname, '../ssl/server.pem'));

const sslKey = fs.existsSync(config.paths.ssl.key)
  ? fs.readFileSync(config.paths.ssl.key)
  : fs.readFileSync(path.join(__dirname, '../ssl/server.pem'));

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

const assetsHash = {};

/**
 * Return an array of changed files that have been written to the file system.
 * Uses the same method as write-file-webpack-plugin to determine which files
 * have changed.
 * @see https://github.com/gajus/write-file-webpack-plugin/blob/master/src/index.js#L134-L145
 *
 * @param   assets  Object   Assets obejct from webpack stats.compilation object
 * @return          Array
 */
function getFilesFromAssets(stats) {
  const assets = stats.compilation.assets;
  let files = [];

  Object.keys(assets).forEach(key => {
    if (key === 'static.js') {
      return;
    }

    const asset = assets[key];

    if (asset.emitted && fs.existsSync(asset.existsAt)) {
      if (key === 'scripts.js') {
        const assetHash = stats.compilation.chunks[0].hash;

        if (!assetsHash[key] || assetsHash[key] !== assetHash) {
          files = [...files, asset.existsAt.replace(config.paths.dist, '')];
          assetsHash[key] = assetHash;
        }
      } else {
        const source = asset.source();
        const assetSource = Array.isArray(source) ? source.join('\n') : source;
        const assetHash = createHash('sha256')
          .update(assetSource)
          .digest('hex');

        // new file, or existing one that changed
        if (!assetsHash[key] || assetsHash[key] !== assetHash) {
          files = [...files, asset.existsAt.replace(config.paths.dist, '')];
          assetsHash[key] = assetHash;
        }
      }
    }
  });

  return files;
}

app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  next();
});

app.use(
  webpackDevMiddleware(compiler, {
    quiet: true,
    reload: false,
  }),
);

const hotMiddleware = webpackHotMiddleware(compiler);
app.use(hotMiddleware);

compiler.plugin('compile', () => {
  clearConsole();
  spinner = ora(chalk.magenta(' Compiling...')).start();
});

compiler.plugin('done', async stats => {
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
    messages.errors.forEach(message => {
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
    messages.warnings.forEach(message => {
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
  const files = getFilesFromAssets(stats);

  if (!files.length) {
    return;
  }

  // files.forEach(file => {
  //   console.log(`\t${file}`);
  // });
  // console.log('\n');

  const liquidFiles = files.filter(file => path.extname(file) === '.liquid');

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
  } else {
    if (isFirstDeploy) {
      isFirstDeploy = false;
    }

    event('slate-tools:start:sync-start', {version: packageJson.version});

    sync(files)
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
      .catch(error => {
        event('slate-tools:start:sync-error', {
          error,
          version: packageJson.version,
        });
        console.log(chalk.red(error));
      });
  }
});

server.listen(config.port);
