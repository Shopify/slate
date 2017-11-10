/* eslint-disable no-use-before-define */
const prompt = require('react-dev-utils/prompt');
const themekit = require('@shopify/themekit').command;
const config = require('../config');
const promptIfMainTheme = require('./prompt-if-main-theme');

const settings = {
  env: 'development',
  deployRoot: config.paths.dist,
  defaultArgs: [
    '--no-update-notifier',
    '--config',
    config.paths.userShopifyConfig,
  ],
};

let deploying = false;
let filesToDeploy = [];

function maybeDeploy() {
  if (deploying) {
    return Promise.reject('Deploy already in progress.');
  }

  if (filesToDeploy.length) {
    const files = [...filesToDeploy];
    filesToDeploy = [];
    return deploy('upload', files, settings.env);
  }

  return Promise.resolve();
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
        args: [cmd, '--env', settings.env, ...settings.defaultArgs, ...files],
        cwd: settings.deployRoot,
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
  sync(env, files = []) {
    if (!files.length) {
      return Promise.reject('No files to deploy.');
    }

    settings.env = env;

    return new Promise((resolve, reject) => {
      promptIfMainTheme(settings.env)
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
    settings.env = env;

    return new Promise((resolve, reject) => {
      const message = `Environment is ${
        settings.env
      }. Go ahead with "replace" ?`;

      prompt(message, false).then(isYes => {
        if (isYes) {
          promptIfMainTheme(settings.env)
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
