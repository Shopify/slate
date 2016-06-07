var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var fs = require('fs');
var yaml = require('js-yaml');
var Promise = require('bluebird');
var readFile = Promise.promisify(fs.readFile);

var config = require('./includes/config.js');
var messages = require('./includes/messages.js');

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
    fs.writeFile(config.deployLog, '');
  }

  // read the store url from the config file
  return readFile(config.tkConfig, 'utf8')
    .then(function(response) {
      var tkConfig = yaml.safeLoad(response);
      browserSync.init({
        proxy: 'https://' + tkConfig[config.environment].store
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
  gulp.watch(config.tkConfig, ['deploy:sync-init']); // re-init on settings change
  gulp.watch(config.deployLog, function() {
    messages.logTransferDone();
    browserSync.reload();
  });
});
