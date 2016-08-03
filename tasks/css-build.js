var gulp = require('gulp');
var cssimport = require('gulp-cssimport');
var extReplace = require('gulp-ext-replace');
var plumber = require('gulp-plumber');
var chokidar = require('chokidar');

var config = require('./includes/config.js');
var utils = require('./includes/utilities.js');
var messages = require('./includes/messages.js');


/**
 * Concatenate css via gulp-cssimport
 *
 * @function build:css
 * @memberof slate-cli.tasks.build
 * @static
 */
gulp.task('build:css', ['lint:css'], function() {
  return processCss();
});

/**
 * Watches css in the `/src` directory
 *
 * @function watch:css
 * @memberof slate-cli.tasks.watch
 * @static
 */
gulp.task('watch:css', function() {
  chokidar.watch(config.src.css, {ignoreInitial: true})
    .on('all', function(event, path) {
      messages.logFileEvent(event, path);
      processCss();
    });
});

/**
 * Concatenate css via gulp-cssimport and copys to the `/dist` folder
 *
 * @param {Array} files
 * @returns {Stream}
 * @private
 */
function processCss() {
  messages.logProcessFiles('build:css');
  return gulp.src(config.roots.css)
    .pipe(plumber(utils.errorHandler))
    .pipe(cssimport())
    .pipe(extReplace('.scss.liquid'))
    .pipe(gulp.dest(config.dist.assets));
}
