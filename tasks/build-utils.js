var gulp = require('gulp');
var pkg = require('../package.json');
var del = require('del');
var zip = require('gulp-zip');
var size = require('gulp-size');
var plumber = require('gulp-plumber');

var config = require('./includes/config.js');
var utils = require('./includes/utilities.js');

/**
 * Clean up build dirs/files whenever doing a full/clean (re)build.
 *
 * @function build:clean
 * @memberof slate-cli.tasks.build
 * @static
 */
gulp.task('clean', function() {
  return del(['upload', 'dist']);
});

/**
 * Compress theme and build a shopify-compatible `.zip` file for uploading to store
 *
 * @function compress
 * @memberof slate-cli.tasks.deploy
 * @static
 */
gulp.task('compress', function() {
  var distFiles = config.dist.root + '**/*';
  var ignoreConfig = '!' + config.dist.root + 'config.yml';

  return gulp.src([distFiles, ignoreConfig])
    .pipe(plumber(utils.errorHandler))
    .pipe(zip(pkg.name + '.zip'))
    .pipe(size({showFiles: true, pretty: true}))
    .pipe(gulp.dest('./upload/'));
});
