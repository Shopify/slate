const argv = require('minimist')(process.argv.slice(2));
const figures = require('figures');
const chalk = require('chalk');
const ora = require('ora');
const consoleControl = require('console-control-strings');
const clearConsole = require('react-dev-utils/clearConsole');
const env = require('@shopify/slate-env');
const {event} = require('@shopify/slate-analytics');

const promptContinueIfPublishedTheme = require('../prompts/continue-if-published-theme');
const promptSkipSettingsData = require('../prompts/skip-settings-data');
const AssetServer = require('../../tools/asset-server');
const DevServer = require('../../tools/dev-server');
const webpackConfig = require('../../tools/webpack/config/dev');
const config = require('../../slate-tools.config');
const packageJson = require('../../package.json');

const options = {
  env: argv.env,
  skipFirstDeploy: argv.skipFirstDeploy,
  webpackConfig,
};
const spinner = ora(chalk.magenta(' Compiling...'));
let firstSync = true;
let skipSettingsData = null;
let continueIfPublishedTheme = null;

const assetServer = new AssetServer(options);
const devServer = new DevServer();
const previewUrl = `https://${env.getStoreValue()}?preview_theme_id=${env.getThemeIdValue()}`;

assetServer.compiler.hooks.compile.tap('CLI', () => {
  clearConsole();
  spinner.start();
});

assetServer.compiler.hooks.done.tap('CLI', (stats) => {
  const statsJson = stats.toJson({}, true);

  spinner.stop();
  clearConsole();

  if (statsJson.errors.length) {
    event('slate-tools:start:compile-errors', {
      errors: statsJson.errors,
      version: packageJson.version,
    });

    console.log(chalk.red('Failed to compile.\n'));
    console.log(config.paths.lib);

    statsJson.errors.forEach((message) => {
      console.log(`${message}\n`);
    });
  }

  if (statsJson.warnings.length) {
    event('slate-tools:start:compile-warnings', {
      duration: statsJson.time,
      warnings: statsJson.warnings,
      version: packageJson.version,
    });

    console.log(chalk.yellow('Compiled with warnings.\n'));

    statsJson.warnings.forEach((message) => {
      console.log(`${message}\n`);
    });
  }

  if (!statsJson.errors.length && !statsJson.warnings.length) {
    event('slate-tools:start:compile-success', {
      duration: statsJson.time,
      version: packageJson.version,
    });

    console.log(
      `${chalk.green(figures.tick)}  Compiled successfully in ${statsJson.time /
        1000}s!`,
    );
  }
});

assetServer.client.hooks.beforeSync.tapPromise('CLI', async (files) => {
  if (firstSync && argv.skipFirstDeploy) {
    assetServer.skipDeploy = true;

    return;
  }

  if (continueIfPublishedTheme === null) {
    try {
      continueIfPublishedTheme = await promptContinueIfPublishedTheme();
    } catch (error) {
      event('slate-tools:start:error', {
        version: packageJson.version,
        error,
      });
      console.log(`\n${chalk.red(error)}\n`);
    }
  }

  if (!continueIfPublishedTheme) {
    process.exit(0);
  }

  if (skipSettingsData === null) {
    skipSettingsData = await promptSkipSettingsData(files);
  }

  if (skipSettingsData) {
    assetServer.files = files.filter(
      (file) => !file.endsWith('settings_data.json'),
    );
  }
});

assetServer.client.hooks.syncSkipped.tap('CLI', () => {
  if (!(firstSync && argv.skipFirstDeploy)) return;

  event('slate-tools:start:skip-first-deploy', {
    version: packageJson.version,
  });

  console.log(
    `\n${chalk.blue(
      figures.info,
    )}  Skipping first deployment because --skipFirstDeploy flag`,
  );
});

assetServer.client.hooks.sync.tap('CLI', () => {
  event('slate-tools:start:sync-start', {version: packageJson.version});
});

assetServer.client.hooks.syncDone.tap('CLI', () => {
  event('slate-tools:start:sync-end', {version: packageJson.version});

  process.stdout.write(consoleControl.previousLine(4));
  process.stdout.write(consoleControl.eraseData());

  console.log(`\n${chalk.green(figures.tick)}  Files uploaded successfully!`);
});

assetServer.client.hooks.afterSync.tap('CLI', async () => {
  if (firstSync) {
    firstSync = false;
    await devServer.start();
  }

  const urls = devServer.server.options.get('urls');

  console.log();
  console.log(
    `${chalk.yellow(
      figures.star,
    )}  You are editing files in theme ${chalk.green(
      env.getThemeIdValue(),
    )} on the following store:\n`,
  );

  console.log(`      ${chalk.cyan(previewUrl)}`);

  console.log();
  console.log(`   Your theme can be previewed at:\n`);
  console.log(
    `      ${chalk.cyan(urls.get('local'))} ${chalk.grey('(Local)')}`,
  );
  console.log(
    `      ${chalk.cyan(urls.get('external'))} ${chalk.grey('(External)')}`,
  );
  console.log();
  console.log(`   Local assets are being served from:\n`);

  console.log(`      ${chalk.cyan(`https://localhost:${assetServer.port}`)}`);

  console.log();
  console.log(`   The Browsersync control panel is available at:\n`);
  console.log(`      ${chalk.cyan(urls.get('ui'))} ${chalk.grey('(Local)')}`);
  console.log(
    `      ${chalk.cyan(urls.get('ui-external'))} ${chalk.grey('(External)')}`,
  );

  console.log(chalk.magenta('\nWatching for changes...'));
});

event('slate-tools:start:start', {version: packageJson.version});

assetServer.start().catch((error) => {
  console.error(error);
});
