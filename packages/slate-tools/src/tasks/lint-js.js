const gulp = require('gulp');
const eslint = require('gulp-eslint');
const plumber = require('gulp-plumber');
const chokidar = require('chokidar');

const config = require('./includes/config.js');
const utils = require('./includes/utilities.js');

/**
 * Lints JS files for potetential errors
 *
 * @param {Array} files
 * @returns {Stream}
 * @private
 */
function processLint() {
  return gulp.src([config.src.js, config.src.jsSections])
    .pipe(plumber(utils.errorHandler))
    .pipe(eslint())
    .pipe(eslint.format())
    // fixes weird issue with linting during watch
    .on('data', () => {}); // eslint-disable-line no-empty-function
}

/**
 * JS Linter - Checks your js files for potential errors
 *
 * @function build:js-lint
 * @memberof slate-cli.tasks.build
 * @static
 */
gulp.task('lint:js', () => {
  return processLint();
});

/**
 * Watches JS in `/src` directory
 *
 * @function watch:js-lint
 * @memberof slate-cli.tasks.watch
 * @static
 */
gulp.task('watch:lint-js', () => {
  chokidar.watch([config.src.js, config.src.jsSections], {
    ignoreInitial: true
  })
  .on('all', () => {
    return processLint();
  });
});
