var gulp = require('gulp');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var chokidar = require('chokidar');
var gutil = require('gulp-util');
var size = require('gulp-size');
var stream = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var uglify = require('gulp-uglify');

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
gulp.task('build:vendor-js', ['lint:js'], function() {
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
  chokidar.watch(config.src.vendorJs, {ignoreInitial: true})
  .on('all', function(event, path) {
    // messages.logFileEvent(event, path);
    processVendorJs();
  });
});

function processVendorJs() {
  messages.logProcessFiles('build:vendor-js');
  return gulp.src(config.src.vendorJs)
  .pipe(plumber(utils.errorHandler))
  .pipe(concat('vendor.js'))
  .pipe(gulp.dest(config.dist.assets));
}


gulp.task('build:js', function() {
  var bundler = browserify(config.roots.js, {
    extensions: ['.js', '.js.liquid'],
    debug: false
  });

  return bundle(bundler);
});

gulp.task('watch:js', function() {

  var bundler = browserify({
    entries: [config.roots.js],
    extensions: ['.js', '.js.liquid'],
    debug: false,
    plugin: [watchify],
    cache: {},
    packageCache: {}
  }).on('update', function() {
    bundle(bundler);
  });

  return bundle(bundler);
});

/**
 *
 * @param bundler {Object} - watchify instance
 * @returns {} -
 * @private
 */
function bundle(bundler) {
  messages.logBundleJs();
  return bundler.bundle()
  .on('error', utils.errorHandler)
  .pipe(stream('theme.js.liquid'))
  .pipe(buffer())
  .pipe(size({showFiles: true, pretty: true}))
  .pipe(gulp.dest(config.dist.assets));
}
