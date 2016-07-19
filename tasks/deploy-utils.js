var gulp = require('gulp');
var spawn = require('child_process').spawn;
var Promise = require('bluebird');
var fs = require('fs');
var open = Promise.promisify(require('open'));
var readFile = Promise.promisify(fs.readFile);
var yaml = require('js-yaml');

var config = require('./includes/config.js');
var utils = require('./includes/utilities.js');

/**
 * Replace your existing theme using ThemeKit.
 * @function deploy:replace
 * @memberof slate-cli.tasks.deploy
 * @static
 */
gulp.task('deploy:replace', function() {
  return utils.resolveShell(
    spawn('slate', ['replace'], {cwd: config.dist.root})
  );
});

/**
 * Opens the Store in the default browser (for manual upgrade/deployment)
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
 * @function open:zip
 * @memberof slate-cli.tasks.deploy
 * @static
 */
gulp.task('open:zip', function() {
  return open('./upload/');
});
