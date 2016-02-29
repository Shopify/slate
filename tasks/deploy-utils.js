var gulp = require('gulp');
var gutil = require('gulp-util');
var spawn = require('child_process').spawn;
var zip = require('gulp-zip');
var plumber = require('gulp-plumber');
var Promise = require('bluebird');
var open = Promise.promisify(require('open'));

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
 * compress theme and prepare it for the theme store
 * @function deploy:zip
 * @memberof slate-cli.tasks.deploy
 * @static
 */
gulp.task('deploy:zip', function() {
  var distFiles = config.paths.dist + '**/*.*';
  var distConfig = config.paths.dist + 'config.yml';

  return gulp.src([distFiles, '!' + distConfig])
    .pipe(plumber(utils.errorHandler))
    .pipe(zip(config.zipFileName))
    .pipe(gutil.log('zip file created'))
    .pipe(gulp.dest('./'));
});

/**
 * Opens your Storefront Editor in the default browser (for manual upgrade/deployment).
 * @function deploy:open-sfe
 * @memberof slate-cli.tasks.deploy
 * @static
 */
gulp.task('deploy:open-sfe', function() {
  return open({uri: config.storeURI});
});
