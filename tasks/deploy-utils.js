/* eslint-disable no-sync */

var gulp = require('gulp');
var spawn = require('child_process').spawn;
var Promise = require('bluebird');
var fs = require('fs');
var open = Promise.promisify(require('open'));
var yaml = require('js-yaml');

var config = require('./includes/config.js');
var messages = require('./includes/messages.js');
var utils = require('./includes/utilities.js');


/**
 * Replace your existing theme using ThemeKit.
 *
 * @function deploy:replace
 * @memberof slate-cli.tasks.deploy
 * @static
 */
gulp.task('deploy:replace', function() {
  var file = fs.readFileSync(config.tkConfig, 'utf8');
  var tkConfig = yaml.safeLoad(file);
  var envObj;

  if (process.env.tkEnvironments) {
    var environments = process.env.tkEnvironments.split(/\s*,\s*|\s+/);
    var promises = [];

    environments.forEach(function(environment) {
      function factory() {
        envObj = tkConfig[environment];
        messages.deployTo(environment);
        return utils.checkThemeId(environment, envObj)
          .then(function(env) {
            if (env) {
              return deploy(env);
            } else {
              return Promise.resolve();
            }
          });
      }
      promises.push(factory);
    });

    return utils.promiseSeries(promises)
      .then(function() {
        messages.allDeploysComplete();
      });

  } else {
    envObj = tkConfig[config.environment];
    messages.deployTo(config.environment);
    return utils.checkThemeId(config.environment, envObj)
      .then(function(env) {
        if (env) {
          return deploy(env);
        } else {
          return Promise.resolve();
        }
      });
  }
});

/**
 * Opens the Store in the default browser (for manual upgrade/deployment)
 *
 * @function open:admin
 * @memberof slate-cli.tasks.deploy
 * @static
 */
gulp.task('open:admin', function() {
  var file = fs.readFileSync(config.tkConfig, 'utf8');
  var tkConfig = yaml.safeLoad(file);
  var envObj;

  if (process.env.tkEnvironments) {
    var environments = process.env.tkEnvironments.split(/\s*,\s*|\s+/);
    var promises = [];

    environments.forEach(function(environment) {
      function factory() {
        envObj = tkConfig[environment];
        return open('https://' + envObj.store + '/admin/themes');
      }
      promises.push(factory);
    });

    return utils.promiseSeries(promises);
  } else {
    envObj = tkConfig[config.environment];
    return open('https://' + envObj.store + '/admin/themes');
  }
});

/**
 * Opens the Zip file in the file browser
 *
 * @function open:zip
 * @memberof slate-cli.tasks.deploy
 * @static
 */
gulp.task('open:zip', function() {
  return open('./upload/');
});

/**
 * simple promise factory wrapper for deploys
 * @param env - the environment to deploy to
 * @returns {Promise}
 * @private
 */
function deploy(env) {
  return utils.resolveShell(
    spawn('slate', ['replace', '--environment', env], {cwd: config.dist.root})
  );
}
