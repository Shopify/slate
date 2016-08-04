var gulp = require('gulp');
var spawn = require('child_process').spawn;
var Promise = require('bluebird');
var fs = require('fs');
var open = Promise.promisify(require('open'));
var readFile = Promise.promisify(fs.readFile);
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

  if (process.env.tkEnvironments) {
    var environments = process.env.tkEnvironments.split(/\s*,\s*|\s+/);
    var promises = [];

    environments.forEach(function(environment) {
      function factory() {
        messages.deployTo(environment);
        return utils.resolveShell(
          spawn('slate', ['replace', environment], {cwd: config.dist.root})
        );
      }

      promises.push(factory);
    });

    return utils.promiseSeries(promises)
      .then(function() {
        messages.allDeploysComplete();
      });

  } else {
    return utils.resolveShell(
      spawn('slate', ['replace'], {cwd: config.dist.root})
    );
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
  return readFile(config.tkConfig, 'utf8')
    .then(function(response) {
      var tkConfig = yaml.safeLoad(response);
      return open('https://' + tkConfig[config.environment].store + '/admin/themes');
    });
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
