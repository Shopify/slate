var gulp = require('gulp');
var plumber = require('gulp-plumber');
var size = require('gulp-size');
var chokidar = require('chokidar');

var config = require('./includes/config.js');
var utils = require('./includes/utilities.js');
var messages = require('./includes/messages.js');


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
  return processConfig(config.tkConfig);
});

/**
 * Watch the config file in our `src/` folder and move it to `dist/`
 * Watches the config file in our dist folder and throw an error to stop all tasks
 * or watchers when it changes.  Otherwise Themekit will quietly start uploading
 * files to the new shops defined in `dist/config.yml` with no warning to the user
 *
 * @function watch:config
 * @memberof slate-cli.tasks.watch
 * @static
 */
gulp.task('watch:config', function() {
  chokidar.watch(config.tkConfig, {ignoreInitial: true})
    .on('all', function(event, path) {
      messages.logFileEvent(event, path);
      processConfig(path);
    });
});

/**
 * Watch the config file in our dist folder and throw an error to stop all tasks
 * or watchers when it changes.  Otherwise Themekit will quietly start uploading
 * files to the new shops defined in `dist/config.yml` with no warning to the user
 *
 * @function watch:dist-config
 * @memberof slate-cli.tasks.watch
 * @static
 */
gulp.task('watch:dist-config', function() {
  chokidar.watch(config.dist.root + config.tkConfig, {ignoreInitial: true})
    .on('all', function(event, path) {
      messages.logFileEvent(event, path);

      throw new Error(messages.configChange());
    });
});

function processConfig(file) {
  messages.logProcessFiles('build:config', file);

  return gulp.src(file)
    .pipe(plumber(utils.errorHandler))
    .pipe(size({showFiles: true, pretty: true}))
    .pipe(gulp.dest(config.dist.root));
}
