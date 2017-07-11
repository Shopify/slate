const gulp = require('gulp');
const gutil = require('gulp-util');
const {runAll} = require('@shopify/theme-lint');

const config = require('./includes/config.js');
const Reporter = require('./includes/lint-reporter.js').default;

/**
 * Runs all the translation tests and the reporter outputs
 * the locale results once completed.
 *
 * @returns {String} Finalized linting output
 * @private
 */
function lintLocales() {
  return runAll(config.src.root, new Reporter())
    .then((reporter) => reporter.output())
    .catch((err) => {
      gutil.log(err);

      process.exit(2);
    });
}

/**
 * Runs translation tests using @shopify/theme-lint
 *
 * @function lint:locales
 * @memberof slate-cli.tasks.lint
 * @static
 */
gulp.task('lint:locales', () => {
  return lintLocales();
});
