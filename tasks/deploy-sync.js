var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var fs = require('fs');
var yaml = require('js-yaml');

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
gulp.task('deploy:sync-init', function() {
  if (browserSync.active) {
    browserSync.exit();
  } else {
    fs.writeFile(config.deployLog, '');
  }

  var file = fs.readFileSync(config.tkConfig, 'utf8'); // eslint-disable-line no-sync
  var tkConfig = yaml.safeLoad(file);
  var envObj;
  var environment;
  var queryString = '';

  if (process.env.tkEnvironments) {
    var environments = process.env.tkEnvironments.split(/\s*,\s*|\s+/);
    environment = environments[0];
  } else {
    environment = config.environment;
  }

  envObj = tkConfig[environment];

  if (envObj.theme_id && (envObj.theme_id === parseInt(envObj.theme_id, 10))) {
    queryString = '?preview_theme_id=' + envObj.theme_id;
  }

  browserSync.init({
    proxy: 'https://' + envObj.store + queryString
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
  gulp.watch(config.tkConfig, ['deploy:sync-init']);
  gulp.watch(config.deployLog, function() {
    messages.logTransferDone();
    browserSync.reload();
  });
});
