const gulp = require('gulp');
const _ = require('lodash');
const debug = require('debug')('slate-tools:watchers');
const chokidar = require('chokidar');
const fs = require('fs');
const argv = require('yargs').argv;
const themekit = require('@shopify/themekit');

const config = require('./includes/config.js');
const utils = require('./includes/utilities.js');
const messages = require('./includes/messages.js');

const cache = utils.createEventCache();
const debouncedDeployStatus = _.debounce(checkDeployStatus, 320); // prevent early execution on multi-file events
const lintTasks = config.enableLinting ? ['watch:css-lint', 'watch:js-lint', 'watch:json-lint'] : [];

let activeDeploy = false;

/**
 * Aggregate task watching for file changes in `src` and
 * building/cleaning/updating `dist` accordingly.  *Made up of individual tasks
 * referenced in other files
 *
 * @function watch:src
 * @memberof slate-cli.tasks.watch
 * @static
 */
gulp.task('watch:src', [
  'watch:assets',
  'watch:config',
  'watch:svg',
  'watch:css',
  'watch:js',
  'watch:vendor-js',
  'watch:sections'
].concat(lintTasks));

/**
 * Watches for changes in the `./dist` folder and passes event data to the
 * `cache` via {@link pushToCache}. A debounced {@link deployStatus} is also
 * called to pass files updated to the remote server through {@link deploy}
 * when any active deploy completes.
 *
 * @function watch:dist
 * @memberof slate-cli.tasks.watch
 * @static
 */
gulp.task('watch:dist', () => {
  const watcher = chokidar.watch(['./', '!config.yml'], {
    cwd: config.dist.root,
    ignoreInitial: true
  });

  watcher.on('all', (event, path) => {
    messages.logFileEvent(event, path);
    cache.addEvent(event, path);
    debouncedDeployStatus();
  });
});

/**
 * If no deploy is active, call {@link deploy} passing files stored in
 *
 * @private
 */
function checkDeployStatus() {
  if (activeDeploy) {
    return;
  } else {
    let environment;

    if (argv.environment) {
      environment = argv.environment;
    } else {
      environment = config.environment;
    }

    messages.deployTo(environment);

    if (cache.change.length) {
      deploy('upload', cache.change, environment);
      cache.change = [];
    } else if (cache.unlink.length) {
      deploy('remove', cache.unlink, environment);
      cache.unlink = [];
    }
  }
}

/**
 * Executes a deployment (wrapped in a promise).  When the initial deploy
 * resolves, executes a call to {@link deployStatus}, recursively iterating
 * through subsequent cached files and deploying until no changes remain.
 *
 * @param {String|Array} cmd - the ThemeKit command to run (upload|remove)
 * @param {Array} files - an array of files to upload or remove @ the remote
 *   server
 * @private
 */
function deploy(cmd, files, env) {
  messages.logChildProcess(cmd);
  activeDeploy = true;

  return new Promise((resolve, reject) => {
    const cwd = process.cwd();

    process.chdir(config.dist.root);
    debug(`Changing cwd to: ${process.cwd()}`);
    debug(`Deploying to ${env}`);

    return themekit.command({
      args: [cmd, '-env', env].concat(files)
    }, (err) => {
      if (err) {
        reject(err);
      } else {
        process.chdir(cwd);
        resolve();
      }
    });
  })
  .then(() => {
    activeDeploy = false;
    fs.appendFile(config.deployLog, messages.logDeploys(cmd, files));
    return checkDeployStatus();
  });
}
