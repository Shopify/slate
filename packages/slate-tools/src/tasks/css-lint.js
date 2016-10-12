var gulp = require('gulp');
var scssLint = require('gulp-sass-lint');
var plumber = require('gulp-plumber');
var chokidar = require('chokidar');

var config = require('./includes/config.js');
var utils = require('./includes/utilities.js');

/**
 * SCSS Linter - Checks your scss files for potential errors
 *
 * @function build:scss-lint
 * @memberof slate-cli.tasks.build
 * @static
 */
gulp.task('lint:css', function() {
  return processLint(config.src.cssLint);
});

/**
 * Watches SCSS in `/src` directory
 *
 * @function watch:scss-lint
 * @memberof slate-cli.tasks.watch
 * @static
 */
gulp.task('watch:css-lint', function() {
  chokidar.watch([config.src.cssLint, '!' + config.src.vendorCss])
    .on('all', function(event, files) {
      return processLint(files);
    });
});

/**
 * Lints SCSS files for potetential errors
 *
 * @param {Array} files
 * @returns {Stream}
 * @private
 */
function processLint(files) {
  return gulp.src(files)
    .pipe(plumber(utils.errorHandler))
    .pipe(scssLint({
      configFile: config.scssLintConfig
    }))
    .pipe(scssLint.format())
    .pipe(scssLint.failOnError());
}
