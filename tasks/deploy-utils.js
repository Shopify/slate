/* eslint-disable no-sync */

var gulp = require('gulp');
var spawn = require('child_process').spawn;
var Promise = require('bluebird');
var fs = require('fs');
var open = Promise.promisify(require('open'));
var yaml = require('js-yaml');
var inquirer = require('inquirer');

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
        return checkThemeId(envObj);
      }
      promises.push(factory);
    });

    return utils.promiseSeries(promises)
      .then(function() {
        messages.allDeploysComplete();
      });

  } else {
    envObj = tkConfig[config.environment];
    return checkThemeId(envObj);
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

  return open('https://' + tkConfig[config.environment].store + '/admin/themes');
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
 * Checks a yaml environment object to see if a theme_id property is present
 * if no theme_id exists, prompt the user to ensure nothing gets overwritten
 * if theme_id is not a number, prompt the user to ensure nothing gets overwritten
 * @param environment
 * @returns {Promise}
 * @private
 */
function checkThemeId(environment) {
  var validThemeId = true;

  if (!environment.theme_id) {
    validThemeId = false;
  } else if (environment.theme_id !== parseInt(environment.theme_id, 10)) {
    validThemeId = false;
  }

  if (!validThemeId && !process.env.activeTheme) {
    return inquirer.prompt([{
      type: 'confirm',
      name: 'active',
      message: messages.overwriteActiveTheme()
    }])
      .then(function(answers) {
        if (answers.active) {
          return startDeploy(environment);
        } else {
          return Promise.resolve();
        }
      });

  } else {
    return startDeploy(environment);
  }
}

/**
 * simple promise factory wrapper for deploys
 * @param env - the environment to deploy to
 * @returns {Promise}
 * @private
 */
function startDeploy(env) {
  return utils.resolveShell(
    spawn('slate', ['replace', env], {cwd: config.dist.root})
  );
}
