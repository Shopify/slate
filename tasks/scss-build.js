var gulp = require('gulp');
var cssimport = require('gulp-cssimport');
var plumber = require('gulp-plumber');
var chokidar = require('chokidar');

var config = require('./reqs/config.js');
var utils = require('./reqs/utilities.js');
var messages = require('./reqs/messages.js');


/**
 * Concatenate scss via gulp-cssimport
 *
 * @function build:scss
 * @memberof slate-cli.tasks.build
 * @static
 */
gulp.task('build:scss', function() {
  return processScss();
});

/**
 * watches scss in src dir ...
 *
 * @function watch:scss
 * @memberof slate-cli.tasks.watch
 * @static
 */
gulp.task('watch:scss', function() {
  chokidar.watch([config.paths.srcScss], {ignoreInitial: true})
    .on('all', function(event, path) {
      messages.logFileEvent(event, path);
      processScss();
    });
});

function processScss() {
  messages.logProcessFiles('build:scss', config.paths.parentIncludeScss);
  return gulp.src(config.paths.parentIncludeScss)
    .pipe(plumber(utils.errorHandler))
    .pipe(cssimport())
    .pipe(gulp.dest(config.paths.destAssets));
}
