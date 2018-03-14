const prompt = require('react-dev-utils/prompt');
const chalk = require('chalk');
const figures = require('figures');
const themekit = require('@shopify/themekit').command;
const slateEnv = require('@shopify/slate-env');
const config = require('./slate-sync.config');
const promptSkipSettingsData = require('./prompt-skip-settings-data');

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

  ignoreFiles.forEach(pattern => {
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

  const skipSettingsData = await promptSkipSettingsData(files);

  if (skipSettingsData) {
    files = files.filter(file => !file.endsWith('settings_data.json'));
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

function promiseThemekitConfig(files) {
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
      err => {
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
      err => {
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
  sync(files = []) {
    if (!files.length) {
      return Promise.reject('No files to deploy.');
    }

    return new Promise((resolve, reject) => {
      // remove duplicate
      filesToDeploy = [...new Set([...filesToDeploy, ...files])];

      maybeDeploy()
        .then(resolve)
        .catch(reject);
    });
  },

  overwrite(env) {
    return new Promise((resolve, reject) => {
      const message = `\nEnvironment is ${slateEnv.getEnvNameValue()}. Go ahead with "replace" ?`;

      prompt(message, false).then(isYes => {
        if (isYes) {
          deploy('replace')
            .then(resolve)
            .catch(reject);
        } else {
          reject('Aborting. You aborted the deploy.');
        }
      });
    });
  },
};

module.exports.promptIfPublishedTheme = require('./prompt-if-published-theme');
