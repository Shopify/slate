var gulp = require('gulp');
var plumber = require('gulp-plumber');
var size = require('gulp-size');
var chokidar = require('chokidar');

var config = require('./reqs/config.js');
var utils = require('./reqs/utilities.js');
var messages = require('./reqs/messages.js');
var events = require('./reqs/events.js');


/**
 * ThemeKit requires the config file to be in the `root` directory for files it
 * will be uploading to our store.  As such we need to move this file to `./dist`
 * before running any deployment tasks.
 *
 * @function build:config
 * @memberof slate-cli.tasks.build
 * @static
 */

gulp.task('build:config', function() {
  return processConfig(config.paths.yamlConfig);
});

gulp.task('watch:config', function() {
  chokidar.watch([config.paths.yamlConfig], {ignoreInitial: true})
    .on('all', function(event, path) {
      messages.logFileEvent(event, path);
      processConfig(path);
      events.emitEvt('stop-watchers');
    });
});

function processConfig(file) {
  messages.logProcessFiles('build:config', file);
  return gulp.src(file)
    .pipe(plumber(utils.errorHandler))
    .pipe(size({showFiles: true, pretty: true}))
    .pipe(gulp.dest(config.paths.dist));
}
