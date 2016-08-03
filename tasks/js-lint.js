var gulp = require('gulp');
var eslint = require('gulp-eslint');
var plumber = require('gulp-plumber');
var chokidar = require('chokidar');

var config = require('./includes/config.js');
var utils = require('./includes/utilities.js');

/**
 * JS Linter - Checks your js files for potential errors
 *
 * @function build:js-lint
 * @memberof slate-cli.tasks.build
 * @static
 */
gulp.task('lint:js', function() {
  return processLint();
});

/**
 * Watches JS in `/src` directory
 *
 * @function watch:js-lint
 * @memberof slate-cli.tasks.watch
 * @static
 */
gulp.task('watch:js-lint', function() {
  chokidar.watch([config.src.js, config.tasks], {ignoreInitial: true})
    .on('all', function() {
      return processLint();
    });
});

/**
 * Lints JS files for potetential errors
 *
 * @param {Array} files
 * @returns {Stream}
 * @private
 */
function processLint() {
  return gulp.src([config.src.js, config.tasks])
    .pipe(plumber(utils.errorHandler))
    .pipe(eslint())
    .pipe(eslint.format());
}
