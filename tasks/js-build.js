var gulp = require('gulp');
var include = require('gulp-include');
var plumber = require('gulp-plumber');
var errorHandler = require('./reqs/utilities.js');
var chokidar = require('chokidar');

var config = require('./reqs/config.js');
var messages = require('./reqs/messages.js');

/**
 * Concatenate JS together into a single file for use in the theme
 *
 * @function build:js
 * @memberof slate-cli.tasks.build
 * @static
 */
gulp.task('build:js', function() {
  processJs();
});

/**
 * watches js in src dir ...
 *
 * @function watch:js
 * @memberof slate-cli.tasks.watch
 * @static
 */
gulp.task('watch:js', function() {
  chokidar.watch([config.paths.srcJs], {ignoreInitial: true})
    .on('all', function(event, path) {
      messages.logFileEvent(event, path);
      processJs();
    });
});

function processJs() {
  messages.logProcessFiles('build:js', config.paths.parentIncludeJs);
  return gulp.src(config.paths.parentIncludeJs)
     .pipe(plumber(errorHandler))
     .pipe(include())
     .pipe(gulp.dest(config.paths.destAssets));
}
