var gulp = require('gulp');
var linter = require('gulp-jsonlint');
var chokidar = require('chokidar');

var config = require('./includes/config.js');

/**
 * JSON Linter - Checks your JSON files for potential errors
 *
 * @function build:js-lint
 * @memberof slate-cli.tasks.build
 * @static
 */
gulp.task('lint:json', function() {
  return processLint();
});

/**
 * Watches JSON files in `/src` directory
 *
 * @function watch:js-lint
 * @memberof slate-cli.tasks.watch
 * @static
 */
gulp.task('watch:json-lint', function() {
  chokidar.watch(config.src.json, {ignoreInitial: true})
    .on('all', function() {
      return processLint();
    });
});

/**
 * Lints JSON files for potetential errors
 *
 * @param {Array} files
 * @returns {Stream}
 * @private
 */
function processLint() {
  return gulp.src(config.src.json)
    .pipe(linter())
    .pipe(linter.reporter());
}
