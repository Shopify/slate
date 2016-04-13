var gulp = require('gulp');
var plumber = require('gulp-plumber');
var chokidar = require('chokidar');
var vinylPaths = require('vinyl-paths');
var del = require('del');
var size = require('gulp-size');

var config = require('./reqs/config.js');
var utils = require('./reqs/utilities.js');
var messages = require('./reqs/messages.js');


/**
 * copies assets to dist dir ...
 * @function build:assets
 * @memberof slate-cli.tasks.build
 * @static
 */
gulp.task('build:assets', function() {
  return processAssets(config.paths.srcAssets);
});

/**
 * watches assets in src dir ...
 * @function watch:assets
 * @memberof slate-cli.tasks.watch
 * @static
 */
gulp.task('watch:assets', function() {
  var cache = utils.createEventCache();

  chokidar.watch([config.paths.srcAssets], {ignoreInitial: true})
    .on('all', function(event, path) {
      messages.logFileEvent(event, path);
      cache.addEvent(event, path);
      utils.processCache(cache, processAssets, removeAssets);
    });
});

/**
 * @param {Array} files
 * @returns {Stream}
 * @private
 */
function processAssets(files) {
  messages.logProcessFiles('build:assets', files);
  return gulp.src(files, {base: config.paths.srcBase})
    .pipe(plumber(utils.errorHandler))
    .pipe(size({showFiles: true, pretty: true}))
    .pipe(gulp.dest(config.paths.dist));
}

/**
 * @param {Array} files
 * @returns {Stream}
 * @private
 */
function removeAssets(files) {
  messages.logProcessFiles('remove:assets', files);
  files = files.map(function(file) {
    file = file.replace('src/', 'dist/');
    return file;
  });

  return gulp.src(files)
    .pipe(plumber(utils.errorHandler))
    .pipe(vinylPaths(del))
    .pipe(size({showFiles: true, pretty: true}));
}
