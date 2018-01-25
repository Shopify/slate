/* eslint-disable */
const prompt = require('react-dev-utils/prompt');
const themekit = require('@shopify/themekit').command;
const slateEnv = require('@shopify/slate-env');
const config = require('../config');
const promptIfMainTheme = require('./prompt-if-main-theme');

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
function deploy(cmd = '', files = []) {
  if (!['upload', 'replace'].includes(cmd)) {
    throw new Error(
      'shopify-deploy.deploy() first argument must be either "upload", "replace"'
    );
  }

  deploying = true;

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
      () => {
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
            deploying = false;

            if (err) {
              reject(err);
            } else {
              resolve();
            }
          }
        );
      }
    );
  })
    .then(() => {
      deploying = false;
      return maybeDeploy();
    })
    .catch(err => {
      deploying = false;
      console.error(err);
      return maybeDeploy();
    });
}

module.exports = {
  sync(files = []) {
    if (!files.length) {
      return Promise.reject('No files to deploy.');
    }

    return new Promise((resolve, reject) => {
      promptIfMainTheme()
        .then(() => {
          // remove duplicate
          filesToDeploy = [...new Set([...filesToDeploy, ...files])];

          maybeDeploy()
            .then(resolve)
            .catch(reject);
        })
        .catch(reject); // user aborted deploy
    });
  },

  overwrite(env) {
    return new Promise((resolve, reject) => {
      const message = `\nEnvironment is ${slateEnv.getEnvNameValue()}. Go ahead with "replace" ?`;

      prompt(message, false).then(isYes => {
        if (isYes) {
          promptIfMainTheme()
            .then(() => {
              deploy('replace')
                .then(resolve)
                .catch(reject);
            })
            .catch(reject); // user aborted deploy
        } else {
          reject('Aborting. You aborted the deploy.');
        }
      });
    });
  },
};
