const gulp = require('gulp');
const gutil = require('gulp-util');
const debug = require('debug')('slate-tools');
const argv = require('yargs').argv;
const runSequence = require('run-sequence');

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
 * Does a full clean/rebuild of your theme and creates a `.zip` compatible with
 * shopify.
 *
 * @function zip
 * @memberof slate-cli.tasks
 * @static
 */
gulp.task('zip', (done) => {
  runSequence('build:zip', 'compress', done);
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
  runSequence('build:config', defineWatchTasks());
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
  runSequence('build', 'deploy:replace', done);
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
