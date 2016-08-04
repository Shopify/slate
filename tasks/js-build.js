var gulp = require('gulp');
var include = require('gulp-include');
var extReplace = require('gulp-ext-replace');
var plumber = require('gulp-plumber');
var chokidar = require('chokidar');

var config = require('./includes/config.js');
var messages = require('./includes/messages.js');
var utils = require('./includes/utilities.js');

/**
 * Concatenate JS together into a single file for use in the theme
 *
 * @function build:js
 * @memberof slate-cli.tasks.build
 * @static
 */
gulp.task('build:js', ['lint:js'], function() {
  processJs();
});

/**
 * Watches js in src dir ...
 *
 * @function watch:js
 * @memberof slate-cli.tasks.watch
 * @static
 */
gulp.task('watch:js', function() {
  chokidar.watch(config.src.js, {ignoreInitial: true})
    .on('all', function(event, path) {
      messages.logFileEvent(event, path);
      processJs();
    });
});

/**
 * Concatenates JS and copys to the `/dist` folder
 *
 * @param {Array} files
 * @returns {Stream}
 * @private
 */
function processJs() {
  messages.logProcessFiles('build:js');
  return gulp.src(config.roots.js)
    .pipe(plumber(utils.errorHandler))
    .pipe(include())
    .pipe(extReplace('.js.liquid'))
    .pipe(gulp.dest(config.dist.assets));
}
