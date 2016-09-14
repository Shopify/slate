var gulp = require('gulp');
var uglify = require('gulp-uglifyjs');
var include = require('gulp-include');
var plumber = require('gulp-plumber');
var chokidar = require('chokidar');

var config = require('./includes/config.js');
var messages = require('./includes/messages.js');
var utils = require('./includes/utilities.js');

var lintTask = config.enableLinting ? ['lint:js'] : [];

/**
 * Concatenate JS together into a single file for use in the theme
 *
 * @function build:js
 * @memberof slate-cli.tasks.build
 * @static
 */
gulp.task('build:vendor-js', function() {
  processVendorJs();
});

/**
 * watches js in src dir ...
 *
 * @function watch:js
 * @memberof slate-cli.tasks.watch
 * @static
 */
gulp.task('watch:vendor-js', function() {
  chokidar.watch(config.roots.vendorJs, {ignoreInitial: true})
  .on('all', function(event, path) {
    messages.logFileEvent(event, path);
    processVendorJs();
  });
});

function processVendorJs() {
  messages.logProcessFiles('build:vendor-js');
  return gulp.src(config.roots.vendorJs)
    .pipe(plumber(utils.errorHandler))
    .pipe(include())
    .pipe(uglify({
      mangle: true,
      compress: true
    }))
    .pipe(gulp.dest(config.dist.assets));
}


gulp.task('build:js', lintTask, function() {
  processThemeJs();
});

gulp.task('watch:js', function() {
  chokidar.watch(config.src.js, {ignoreInitial: true})
  .on('all', function(event, path) {
    messages.logFileEvent(event, path);
    processThemeJs();
  });
});

function processThemeJs() {
  messages.logProcessFiles('build:js');
  return gulp.src(config.roots.js)
    .pipe(plumber(utils.errorHandler))
    .pipe(include())
    .pipe(gulp.dest(config.dist.assets));
}
