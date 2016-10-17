const gulp = require('gulp');
const scssLint = require('gulp-sass-lint');
const plumber = require('gulp-plumber');
const chokidar = require('chokidar');

const config = require('./includes/config.js');
const utils = require('./includes/utilities.js');

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

/**
 * SCSS Linter - Checks your scss files for potential errors
 *
 * @function build:scss-lint
 * @memberof slate-cli.tasks.build
 * @static
 */
gulp.task('lint:css', () => {
  return processLint(config.src.cssLint);
});

/**
 * Watches SCSS in `/src` directory
 *
 * @function watch:scss-lint
 * @memberof slate-cli.tasks.watch
 * @static
 */
gulp.task('watch:lint-css', () => {
  chokidar.watch([config.src.cssLint, `!${config.src.vendorCss}`])
    .on('all', (event, files) => {
      return processLint(files);
    });
});
