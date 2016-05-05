var gulp = require('gulp');
var _ = require('lodash');
var spawn = require('child_process').spawn;
var chokidar = require('chokidar');
var fs = require('fs');

var config = require('./reqs/config.js');
var utils = require('./reqs/utilities.js');
var messages = require('./reqs/messages.js');

var activeDeploy = false;
var cache = utils.createEventCache();
var debouncedDeployStatus = _.debounce(checkDeployStatus, 320); // prevent early execution on multi-file events

/**
 * Aggregate task watching for file changes in `src` and building/cleaning/updating
 * `dist` accordingly.  *Made up of individual tasks referenced in other files
 *
 * @function watch:src
 * @memberof slate-cli.tasks.watch
 * @static
 */
gulp.task('watch:src',
  [
    'watch:assets',
    'watch:config',
    'watch:svg',
    'watch:img',
    'watch:scss-lint',
    'watch:scss',
    'watch:js'
  ]
);

/**
 * Watches for changes in the `./dist` folder and passes event data to the `cache`
 * via {@link pushToCache}. A debounced {@link deployStatus} is also called to pass
 * files updated to the remote server through {@link deploy} when any active deploy
 * completes.
 *
 * @function watch:dist
 * @memberof slate-cli.tasks.watch
 * @static
 */
gulp.task('watch:dist', function() {
  var watcher = chokidar.watch(['./', '!config.yml'], {
    cwd: config.paths.dist,
    ignoreInitial: true
  });

  watcher.on('all', function(event, path) {
    messages.logFileEvent(event, path);
    cache.addEvent(event, path);
    debouncedDeployStatus();
  });
});

/**
 * If no deploy is active, call {@link deploy}
 * passing files stored in `cache`
 * @private
 */
function checkDeployStatus() {
  if (!activeDeploy) {
    if (cache.change.length) {
      deploy('upload', cache.change);
      cache.change = [];

    } else if (cache.unlink.length) {
      deploy('remove', cache.unlink);
      cache.unlink = [];
    }
  }
}

/**
 * Executes a deployment (wrapped in a promise).  When the initial deploy resolves,
 * executes a call to {@link deployStatus}, recursively iterating through subsequent
 * cached files and deploying until no changes remain.
 *
 * @param {String|Array} cmd - the ThemeKit command to run (upload|remove)
 * @param {Array} files - an array of files to upload or remove @ the remote server
 * @private
 */
function deploy(cmd, files) {
  messages.logChildProcess(cmd, files);
  activeDeploy = true;

  utils.resolveShell(spawn('theme', [cmd].concat(files), {cwd: config.paths.dist}))
    .then(function() {
      activeDeploy = false;
      fs.appendFile(config.paths.deployLog, messages.logDeploys(cmd, files));
      checkDeployStatus();
    });
}
