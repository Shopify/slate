const gulp = require('gulp');
const linter = require('gulp-jsonlint');
const chokidar = require('chokidar');

const config = require('./includes/config.js');

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

/**
 * JSON Linter - Checks your JSON files for potential errors
 *
 * @function build:js-lint
 * @memberof slate-cli.tasks.build
 * @static
 */
gulp.task('lint:json', () => {
  return processLint();
});

/**
 * Watches JSON files in `/src` directory
 *
 * @function watch:js-lint
 * @memberof slate-cli.tasks.watch
 * @static
 */
gulp.task('watch:lint-json', () => {
  chokidar.watch(config.src.json, {
    ignoreInitial: true
  })
  .on('all', () => {
    return processLint();
  });
});
