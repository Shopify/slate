var gulp = require('gulp');
var cached = require('gulp-cached');
var scssLint = require('gulp-scss-lint');
var plumber = require('gulp-plumber');
var chokidar = require('chokidar');

var config = require('./reqs/config.js');
var utils = require('./reqs/utilities.js');
var messages = require('./reqs/messages.js');


/**
 * Sass Linter - Checks your scss files for potential errors
 * @function build:scss-lint
 * @memberof slate-cli.tasks.build
 * @static
 */
gulp.task('build:scss-lint', function() {
  return processLint();
});

/**
 * watches scss in src dir ...
 *
 * @function watch:scss-lint
 * @memberof slate-cli.tasks.watch
 * @static
 */
gulp.task('watch:scss-lint', function() {
  chokidar.watch([config.paths.scss], {ignoreInitial: true})
    .on('all', function(event, path) {
      messages.logFileEvent(event, path);
      return processLint();
    });
});

function processLint() {
  return gulp.src(config.paths.scss)
    .pipe(plumber(utils.errorHandler))
    .pipe(cached('scss-lint'))
    .pipe(scssLint(config.scssLint));
}
