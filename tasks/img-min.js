var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var plumber = require('gulp-plumber');
var chokidar = require('chokidar');
var vinylPaths = require('vinyl-paths');
var del = require('del');
var size = require('gulp-size');

var config = require('./reqs/config.js');
var utils = require('./reqs/utilities.js');
var messages = require('./reqs/messages.js');


/**
 * @function build:img
 * @memberof slate-cli.tasks.build
 * @static
 */
gulp.task('build:img', function() {
  return processImages(config.paths.images);
});


/**
 * watches images in src dir ...
 *
 * @function watch:img
 * @memberof slate-cli.tasks.watch
 * @static
 */
gulp.task('watch:img', function() {
  var cache = utils.createEventCache();

  chokidar.watch([config.paths.images], {ignoreInitial: true})
    .on('all', function(event, path) {
      messages.logFileEvent(event, path);
      cache.addEvent(event, path);
      utils.processCache(cache, processImages, removeImages);
    });
});

function processImages(files) {
  messages.logProcessFiles('build:img', files);
  return gulp.src(files)
    .pipe(plumber(utils.errorHandler))
    .pipe(imagemin({optimizationLevel: 3}))
    .pipe(gulp.dest(config.paths.destAssets));
}

function removeImages(files) {
  messages.logProcessFiles('remove:img', files);
  files = files.map(function(file) {
    file = file.replace('src/images', 'dist/assets');
    return file;
  });

  return gulp.src(files)
    .pipe(plumber(utils.errorHandler))
    .pipe(vinylPaths(del))
    .pipe(size({showFiles: true, pretty: true}));
}
