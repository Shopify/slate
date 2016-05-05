var gulp = require('gulp');
var gutil = require('gulp-util');
var spawn = require('child_process').spawn;
var zip = require('gulp-zip');
var plumber = require('gulp-plumber');
var Promise = require('bluebird');
var open = Promise.promisify(require('open'));
var pkg = require('../package.json');

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
 * compress theme and prepare it for the Themes store
 * @function zip
 * @memberof slate-cli.tasks.deploy
 * @static
 */
gulp.task('zip', function() {
  var distFiles = config.paths.dist;
  var distConfig = config.paths.dist + 'config.yml';

  console.log(distFiles);
  console.log(distConfig);
  console.log(pkg.name);

  return gulp.src([distFiles, '!' + distConfig])
    .pipe(plumber(utils.errorHandler))
    .pipe(zip(pkg.name + '.zip'))
    .pipe(gutil.log('zip file created'))
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
