var gulp = require('gulp');
var size = require('gulp-size');
var stream = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');

var config = require('./includes/config.js');
var messages = require('./includes/messages.js');
var utils = require('./includes/utilities.js');

var lintTask = config.enableLinting ? ['lint:js'] : [];

gulp.task('build:js', lintTask, function() {
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
 * Concatenate js via browserify and copys to the `/dist` folder
 *
 * @returns {Stream}
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
