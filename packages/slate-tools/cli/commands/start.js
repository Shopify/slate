// Set NODE_ENV so slate.config.js can return different values for
// production vs development builds
process.env.NODE_ENV = 'development';

const argv = require('minimist')(process.argv.slice(2));
const figures = require('figures');
const chalk = require('chalk');
const ora = require('ora');
const consoleControl = require('console-control-strings');
const clearConsole = require('react-dev-utils/clearConsole');
const ip = require('ip');
const env = require('@shopify/slate-env');
const SlateConfig = require('@shopify/slate-config');

const promptContinueIfPublishedTheme = require('../prompts/continue-if-published-theme');
const promptSkipSettingsData = require('../prompts/skip-settings-data');
const promptExternalTesting = require('../prompts/external-testing');

const AssetServer = require('../../tools/asset-server');
const DevServer = require('../../tools/dev-server');
const webpackConfig = require('../../tools/webpack/config/dev');
const {getAvailablePortSeries} = require('../../tools/utilities');

const config = new SlateConfig(require('../../slate-tools.schema'));

const spinner = ora(chalk.magenta(' Compiling...'));

let firstSync = true;
let skipSettingsData = null;
let continueIfPublishedTheme = null;
let assetServer;
let devServer;
let previewUrl;

Promise.all([
  getAvailablePortSeries(config.get('network.startPort'), 3),
  promptExternalTesting(),
])
  .then(([ports, external]) => {
    const address = external
      ? config.get('network.externalTesting.address') || ip.address()
      : 'localhost';

    assetServer = new AssetServer({
      env: argv.env,
      skipFirstDeploy: argv.skipFirstDeploy,
      webpackConfig,
      port: ports[1],
      address,
    });

    devServer = new DevServer({
      port: ports[0],
      uiPort: ports[2],
      address,
    });

    previewUrl = `https://${env.getStoreValue()}?preview_theme_id=${env.getThemeIdValue()}`;

    assetServer.compiler.hooks.compile.tap('CLI', onCompilerCompile);
    assetServer.compiler.hooks.done.tap('CLI', onCompilerDone);
    assetServer.client.hooks.beforeSync.tapPromise('CLI', onClientBeforeSync);
    assetServer.client.hooks.syncSkipped.tap('CLI', onClientSyncSkipped);
    assetServer.client.hooks.syncDone.tap('CLI', onClientSyncDone);
    assetServer.client.hooks.afterSync.tap('CLI', onClientAfterSync);

    return assetServer.start();
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

function onCompilerCompile() {
  if (process.env.NODE_ENV !== 'test') {
    clearConsole();
  }
  spinner.start();
}

function onCompilerDone(stats) {
  const statsJson = stats.toJson({}, true);

  spinner.stop();

  if (process.env.NODE_ENV !== 'test') {
    clearConsole();
  }

  if (statsJson.errors.length) {
    console.log(chalk.red('Failed to compile.\n'));

    statsJson.errors.forEach((message) => {
      console.log(`${message}\n`);
    });
  }

  if (statsJson.warnings.length) {
    console.log(chalk.yellow('Compiled with warnings.\n'));

    statsJson.warnings.forEach((message) => {
      console.log(`${message}\n`);
    });
  }

  if (!statsJson.errors.length && !statsJson.warnings.length) {
    console.log(
      `${chalk.green(figures.tick)}  Compiled successfully in ${statsJson.time /
        1000}s!`,
    );
  }
}

async function onClientBeforeSync(files) {
  if (firstSync && argv.skipFirstDeploy) {
    assetServer.skipDeploy = true;

    return;
  }

  if (continueIfPublishedTheme === null) {
    try {
      continueIfPublishedTheme = await promptContinueIfPublishedTheme();
    } catch (error) {
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
}

function onClientSyncSkipped() {
  if (!(firstSync && argv.skipFirstDeploy)) return;
  console.log(
    `\n${chalk.blue(
      figures.info,
    )}  Skipping first deployment because --skipFirstDeploy flag`,
  );
}

function onClientSyncDone() {
  process.stdout.write(consoleControl.previousLine(4));
  process.stdout.write(consoleControl.eraseData());

  console.log(`\n${chalk.green(figures.tick)}  Files uploaded successfully!`);
}

async function onClientAfterSync() {
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

  if (devServer.address !== 'localhost') {
    console.log(
      `      ${chalk.cyan(urls.get('external'))} ${chalk.grey('(External)')}`,
    );
  }
  console.log();
  console.log(`   Assets are being served from:\n`);

  console.log(
    `      ${chalk.cyan(`https://localhost:${assetServer.port}`)} ${chalk.grey(
      '(Local)',
    )}`,
  );

  if (assetServer.address !== 'localhost') {
    console.log(
      `      ${chalk.cyan(
        `https://${assetServer.address}:${assetServer.port}`,
      )} ${chalk.grey('(External)')}`,
    );
  }

  console.log();
  console.log(`   The Browsersync control panel is available at:\n`);

  if (devServer.address !== 'localhost') {
    console.log(
      `      ${chalk.cyan(urls.get('ui-external'))} ${chalk.grey(
        '(External)',
      )}`,
    );
  }

  console.log(chalk.magenta('\nWatching for changes...'));
}
