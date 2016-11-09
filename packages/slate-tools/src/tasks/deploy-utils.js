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
    const cwd = process.cwd();

    process.chdir(config.dist.root);
    debug(`Changing cwd to: ${process.cwd()}`);
    debug(`Deploying to ${env}`);

    return themekit.command({
      args: ['replace', '--env', env],
    }, (err) => {
      if (err) {
        reject(err);
      } else {
        process.chdir(cwd);
        resolve();
      }
    });
  });
}

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
  return open('./upload/');
});
