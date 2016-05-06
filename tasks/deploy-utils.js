/* eslint-disable no-sync */

var gulp = require('gulp');
var spawn = require('child_process').spawn;
var zip = require('gulp-zip');
var plumber = require('gulp-plumber');
var Promise = require('bluebird');
var open = Promise.promisify(require('open'));
var pkg = require('../package.json');
var yaml = require('js-yaml');
var fs = require('fs');

var config = require('./reqs/config.js');
var utils = require('./reqs/utilities.js');

/**
 * Replace your existing theme using ThemeKit.
 * @function deploy:replace
 * @memberof slate-cli.tasks.deploy
 * @static
 */
gulp.task('deploy:replace', function() {
  return utils.resolveShell(spawn('theme', ['replace'], {cwd: config.paths.dist}));
});

/**
 * Compress theme and build a shopify-compatible `.zip` file for uploading to store
 * @function compress
 * @memberof slate-cli.tasks.deploy
 * @static
 */
gulp.task('compress', function() {
  var distFiles = config.paths.dist + '**/*';
  var distConfig = config.paths.dist + 'config.yml';

  return gulp.src([distFiles, '!' + distConfig])
    .pipe(plumber(utils.errorHandler))
    .pipe(zip(pkg.name + '.zip'))
    .pipe(gulp.dest('./'));
});

/**
 * Opens the Themes Store in the default browser (for manual upgrade/deployment)
 * for themes available on the Themes Store
 * @function open
 * @memberof slate-cli.tasks.deploy
 * @static
 */
gulp.task('open', function() {
  return open({uri: config.storeURI});
});

/**
 * Opens the Store in the default browser (for manual upgrade/deployment)
 * @function open
 * @memberof slate-cli.tasks.deploy
 * @static
 */
gulp.task('open:sfe', function() {
  var shopUrl = yaml.safeLoad(fs.readFileSync('./' + config.paths.yamlConfig, 'utf8'));
  var editUrl = 'https://' + shopUrl[config.environment].store + '/admin/themes';
  return open(editUrl);
});
