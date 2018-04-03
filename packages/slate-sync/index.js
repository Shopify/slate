const prompt = require('react-dev-utils/prompt');
const chalk = require('chalk');
const figures = require('figures');
const themekit = require('@shopify/themekit').command;
const slateEnv = require('@shopify/slate-env');
const config = require('./slate-sync.config');
const skipSettingData = require('./skip-settings-data');
const continueIfPublished = require('./continue-if-published');

let deploying = false;
let filesToDeploy = [];

function maybeDeploy() {
  if (deploying) {
    return Promise.reject('Deploy already in progress.');
  }

  if (filesToDeploy.length) {
    const files = [...filesToDeploy];
    filesToDeploy = [];
    return deploy('upload', files);
  }

  return Promise.resolve();
}

function _generateConfigFlags() {
  const ignoreFiles = slateEnv.getIgnoreFilesValue();
  const flags = {
    '--password': slateEnv.getPasswordValue(),
    '--themeid': slateEnv.getThemeIdValue(),
    '--store': slateEnv.getStoreValue(),
  };

  // Convert object to key value pairs and flatten the array
  return Array.prototype.concat(...Object.entries(flags));
}

function _generateIgnoreFlags() {
  const ignoreFiles = slateEnv.getIgnoreFilesValue().split(':');
  const flags = [];

  ignoreFiles.forEach((pattern) => {
    flags.push('--ignored-file');
    flags.push(pattern);
  });

  return flags;
}

/**
 * Deploy to Shopify using themekit.
 *
 * @param   cmd     String    The command to run
 * @param   files   Array     An array of files to deploy
 * @return          Promise
 */
async function deploy(cmd = '', files = []) {
  if (!['upload', 'replace'].includes(cmd)) {
    throw new Error(
      'shopify-deploy.deploy() first argument must be either "upload", "replace"',
    );
  }

  deploying = true;

  if (!await continueIfPublished()) {
    process.exit(0);
  }

  if (await skipSettingData(files)) {
    files = files.filter((file) => !file.endsWith('settings_data.json'));
  }

  console.log(chalk.magenta(`\n${figures.arrowUp}  Uploading to Shopify...\n`));

  try {
    await promiseThemekitConfig();
    await promiseThemekitDeploy(cmd, files);
  } catch (error) {
    console.error(error);
  }

  deploying = false;

  return maybeDeploy;
}

function promiseThemekitConfig() {
  return new Promise((resolve, reject) => {
    themekit(
      {
        args: [
          'configure',
          ..._generateConfigFlags(),
          ..._generateIgnoreFlags(),
        ],
        cwd: config.paths.dist,
      },
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      },
    );
  });
}

function promiseThemekitDeploy(cmd, files) {
  return new Promise((resolve, reject) => {
    themekit(
      {
        args: [
          cmd,
          '--no-update-notifier',
          ..._generateConfigFlags(),
          ...files,
        ],
        cwd: config.paths.dist,
      },
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      },
    );
  });
}

module.exports = {
  async sync(files = []) {
    if (!files.length) {
      return Promise.reject('No files to deploy.');
    }

    filesToDeploy = [...new Set([...filesToDeploy, ...files])];

    return maybeDeploy();
  },

  async replace() {
    return deploy('replace');
  },

  async upload() {
    return deploy('upload');
  },
};
