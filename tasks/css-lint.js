var gulp = require('gulp');
var scssLint = require('gulp-sass-lint');
var plumber = require('gulp-plumber');
var chokidar = require('chokidar');

var config = require('./includes/config.js');
var utils = require('./includes/utilities.js');


/**
 * Sass Linter - Checks your scss files for potential errors
 * @function build:scss-lint
 * @memberof slate-cli.tasks.build
 * @static
 */
gulp.task('lint:css', function() {
  return processLint(config.src.cssLint);
});

/**
 * watches scss in src dir ...
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

function processLint(files) {
  return gulp.src(files)
    .pipe(plumber(utils.errorHandler))
    .pipe(scssLint({
      configFile: config.scssLintConfig
    }))
    .pipe(scssLint.format())
    .pipe(scssLint.failOnError());
}
