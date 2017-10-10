/* eslint-disable no-sync,no-process-env */

const gulp = require('gulp');
const Promise = require('bluebird');
const fs = require('fs');
const debug = require('debug')('slate-tools:deploy');
const open = Promise.promisify(require('open'));
const yaml = require('js-yaml');
const themekit = require('@shopify/themekit');

const config = require('./includes/config.js');
const messages = require('./includes/messages.js');
const utils = require('./includes/utilities.js');

/**
 * simple promise factory wrapper for deploys
 * @param env - the environment to deploy to
 * @returns {Promise}
 * @private
 */
function deploy(env) {
  return new Promise((resolve, reject) => {
    debug(`themekit cwd to: ${config.dist.root}`);

    themekit.command({
      args: ['replace', '--env', env],
      cwd: config.dist.root,
    }, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  }).catch((err) => {
    messages.logTransferFailed(err);
  });
}

/**
 * Validate theme_id used for the environment
 * @param {Object} - settings of theme_id and environment
 * @returns {Promise}
 * @private
 */
function validateId(settings) {
  return new Promise((resolve, reject) => {
    // Only string allowed is "live"
    if (settings.themeId === 'live') {
      resolve();
    }

    const id = Number(settings.themeId);

    if (isNaN(id)) {
      reject(settings);
    } else {
      resolve();
    }
  });
}

/**
 * Validate the config.yml theme_id is an integer or "live"
 * @function validate:id
 * @memberof slate-cli.tasks.watch, slate-cli.tasks.deploy
 * @private
 */
gulp.task('validate:id', () => {
  let file;

  try {
    file = fs.readFileSync(config.tkConfig, 'utf8');
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw new Error(err);
    }

    messages.configError();

    return process.exit(2);
  }

  const tkConfig = yaml.safeLoad(file);
  let envObj;

  const environments = config.environment.split(/\s*,\s*|\s+/);
  const promises = [];

  environments.forEach((environment) => {
    function factory() {
      envObj = tkConfig[environment];
      const envSettings = {
        themeId: envObj.theme_id,
        environment,
      };

      return validateId(envSettings);
    }
    promises.push(factory);
  });

  return utils.promiseSeries(promises)
    .catch((result) => {
      // stop process to prevent deploy defaulting to published theme
      messages.invalidThemeId(result.themeId, result.environment);
      return process.exit(2);
    });
});

/**
 * Replace your existing theme using ThemeKit.
 *
 * @function deploy:replace
 * @memberof slate-cli.tasks.deploy
 * @static
 */
gulp.task('deploy:replace', () => {
  debug(`environments ${config.environment}`);

  const environments = config.environment.split(/\s*,\s*|\s+/);
  const promises = [];

  environments.forEach((environment) => {
    function factory() {
      messages.deployTo(environment);
      return deploy(environment);
    }

    promises.push(factory);
  });

  return utils.promiseSeries(promises)
    .then(() => {
      return messages.allDeploysComplete();
    });
});

/**
 * Opens the Store in the default browser (for manual upgrade/deployment)
 *
 * @function open:admin
 * @memberof slate-cli.tasks.deploy
 * @static
 */
gulp.task('open:admin', () => {
  const file = fs.readFileSync(config.tkConfig, 'utf8');
  const tkConfig = yaml.safeLoad(file);
  let envObj;

  const environments = config.environment.split(/\s*,\s*|\s+/);
  const promises = [];

  environments.forEach((environment) => {
    function factory() {
      envObj = tkConfig[environment];
      return open(`https://${envObj.store}/admin/themes`);
    }
    promises.push(factory);
  });

  return utils.promiseSeries(promises);
});

/**
 * Opens the Zip file in the file browser
 *
 * @function open:zip
 * @memberof slate-cli.tasks.deploy
 * @static
 */
gulp.task('open:zip', () => {
  return open('upload');
});
