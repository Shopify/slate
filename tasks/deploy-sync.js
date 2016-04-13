/* eslint-disable no-sync */

var gulp = require('gulp');
var gutil = require('gulp-util');
var browserSync = require('browser-sync').create();
var fs = require('fs');
var yaml = require('js-yaml');
var Promise = require('bluebird');
var readFile = Promise.promisify(fs.readFile);

var config = require('./reqs/config.js');
var messages = require('./reqs/messages.js');

/**
 * Starts a [browserSync]{@link https://www.browsersync.io/} session proxying your
 * store URL when a `--sync` flag is passed to the default `gulp` function.
 *
 * @function deploy:sync-init
 * @memberof slate-cli.tasks.deploy
 * @static
 */
gulp.task('deploy:sync-init', function(done) {
  if (browserSync.active) {
    browserSync.exit(); // stop any existing browsersync instance before (re)running init
  } else {
    // reset deploy log on first init & ensure file exists for watching on reload
    fs.writeFile(config.paths.deployLog, '');
  }

  // read the store url from the config file
  readFile(config.paths.yamlConfig, 'utf8')
    .then(function(response) {
      var browserSyncConfig = yaml.safeLoad(response);
      browserSync.init({
        proxy: 'https://' + browserSyncConfig[config.environment].store
      });
      done();
    });
});

/**
 * Starts a watcher to reload the [browserSync]{@link https://www.browsersync.io/}
 * session whenever a deploy completes.
 *
 * @function deploy:sync-reload
 * @memberof slate-cli.tasks.watch
 * @static
 */
gulp.task('deploy:sync-reload', ['deploy:sync-init'], function() {
  gulp.watch(config.paths.yamlConfig, ['deploy:sync-init']); // re-init on settings change
  gulp.watch(config.paths.deployLog, function() {
    messages.logTransferDone();
    browserSync.reload();
  });
});
