const gulp = require('gulp');
const gutil = require('gulp-util');
const debug = require('debug')('slate-tools');
const argv = require('yargs').argv;
const runSequence = require('run-sequence');

const utils = require('./tasks/includes/utilities.js');

if (argv.environment && argv.environment !== 'undefined') {
  debug(`setting tkEnvironments to ${argv.environment}`);
  gutil.env.environments = argv.environment;
}

// imports gulp tasks from the `tasks` directory
require('require-dir')('./tasks');

gulp.task('build', (done) => {
  runSequence(
    ['clean'],
    ['build:js', 'build:vendor-js', 'build:css', 'build:assets', 'build:config', 'build:svg'],
    ['output:errors'],
    done,
  );
});

gulp.task('build:zip', (done) => {
  runSequence(
    ['clean'],
    ['build:js', 'build:vendor-js', 'build:css', 'build:assets', 'build:svg'],
    done,
  );
});

/**
 * Runs translation tests on each file using @shopify/theme-lint
 *
 * @function test
 * @memberof slate-cli.tasks
 * @static
 */
gulp.task('test', (done) => {
  runSequence('lint:locales', done);
});

/**
 * Does a full clean/rebuild of your theme and creates a `.zip` compatible with
 * shopify.
 *
 * @function zip
 * @memberof slate-cli.tasks
 * @static
 */
gulp.task('zip', (done) => {
  runSequence('build:zip', 'compress', 'output:errors', done);
});

/**
 * Simple wrapper around src & dist watchers
 *
 * @summary Monitor your codebase for file changes and take the appropriate
 *   action
 * @function watch
 * @memberof slate-cli.tasks.watch
 * @static
 */
gulp.task('watch', () => {
  runSequence('validate:id', 'build:config', defineWatchTasks());
});

function defineWatchTasks() {
  const tasks = ['watch:src', 'watch:dist', 'watch:dist-config'];

  // unless --nosync flag is set, start browser-sync
  if (!argv.nosync) {
    tasks.push('deploy:sync-reload');
  }

  return tasks;
}


/**
 * Does a full (re)build followed by a full deploy, cleaning existing files on
 * the remote server and replacing them with the full set of files pushed to
 * `dist` in the build
 *
 * @summary Deploy your built files to the Shopify Store set in
 *   `slate-cli.config`
 * @function deploy:manual
 * @memberof slate-cli.tasks.deploy
 * @static
 */
gulp.task('deploy', (done) => {
  runSequence('validate:id', 'build', 'deploy:replace', done);
});

/**
 * Creates a zip of your theme and opens the store from `config.yml` to manually
 * install a theme from the zip
 *
 * @function deploy:themes-store
 * @memberof slate-cli.tasks.deploy
 * @static
 */
gulp.task('deploy:manual', (done) => {
  runSequence('zip', 'open:admin', 'open:zip', done);
});

/**
 * Default function.  Starts watchers & (optionally) syncs browsers for
 * live-reload type development testing {@link slate-cli}
 *
 * @summary gulp | gulp --sync
 * @function default
 * @memberof slate-cli.tasks
 * @static
 */
gulp.task('default', (done) => {
  runSequence('deploy', 'watch', done);
});

/**
 * Handles the error summary at the end if there are errors to output.
 * This task will only be run for the build and zip tasks.
 */
gulp.task('output:errors', () => {
  utils.outputErrors();
});
