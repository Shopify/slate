/**
 * ## A set of command line tasks for automating deploys, processing files and watching for local changes
 * To get started:
 * ```javascript
 *   gulp [--sync]
 * ```
 *
 * @namespace slate-cli
 */
var gulp = require('gulp');
var argv = require('yargs').argv;

// this is a temporary hack, and will be deprecated when gulp 4.0 is released
var runSequence = require('run-sequence');

// imports gulp tasks from the `tasks` directory
require('require-dir')('./tasks');

/**
 * @summary a series of gulp tasks automating various aspects of theme development
 * @namespace tasks
 * @memberof slate-cli
 */
/**
 * @summary Tasks used to process or organize files prior to deployment to a Shopify store
 * @namespace build
 * @memberof slate-cli.tasks
 */
/**
 * @summary Tasks required for deploying assets to a Shopify store
 * @namespace deploy
 * @memberof slate-cli.tasks
 */
/**
 * @summary Watch tasks monitoring for file changes, and delegating to other tasks appropriately
 * @namespace watch
 * @memberof slate-cli.tasks
 */

/**
 * __dependencies:__  `[build:scss, build:js, build:assets, build:config, build:svg]`
 * Does a full (re)build of the `dist` directory, based on the state of files from
 * the `src` directory
 *
 * @summary Build/Rebuild your source files to match the structural requirements for a Shopify Theme
 * @function build
 * @memberof slate-cli.tasks.build
 * @static
 */
gulp.task('build', function(done) {
  runSequence(
    ['clean'],
    ['build:js', 'build:css', 'build:assets', 'build:sections', 'build:config', 'build:svg'],
    done
  );
});

/**
 * Does a full clean/rebuild of your theme and creates a `.zip` compatible with
 * shopify.
 * @function zip
 * @memberof slate-cli.tasks
 * @static
 */
gulp.task('zip', function(done) {
  runSequence('build', 'compress', done);
});

/**
 * Runs any testing / linting tasks that are specified within this function.
 * @function test
 * @memberof slate-cli.tasks
 * @static
 */
gulp.task('test', function(done) {
  runSequence('lint:js', 'lint:css', 'lint:json', done);
});

/**
 * Simple wrapper around src & dist watchers
 * @summary Monitor your codebase for file changes and take the appropriate action
 * @function watch
 * @memberof slate-cli.tasks.watch
 * @static
 */
gulp.task('watch', function() {
  runSequence('build:config', defineWatchTasks());
});

function defineWatchTasks() {
  var tasks = ['watch:src', 'watch:dist', 'watch:dist-config'];

  // unless --nosync flag is set, start browser-sync
  if (!argv.nosync) {
    tasks.push('deploy:sync-reload');
  }

  return tasks;
}

/**
 * Does a full (re)build followed by a full deploy, cleaning existing files on the
 * remote server and replacing them with the full set of files pushed to `dist` in
 * the build
 *
 * @summary Deploy your built files to the Shopify Store set in `slate-cli.config`
 * @function deploy:manual
 * @memberof slate-cli.tasks.deploy
 * @static
 */
gulp.task('deploy', function(done) {
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
gulp.task('deploy:manual', function(done) {
  runSequence('zip', 'open:admin', 'open:zip', done);
});

/**
 * Default function.  Starts watchers & (optionally) syncs browsers for live-reload
 * type development testing {@link slate-cli}
 *
 * @summary gulp | gulp --sync
 * @function default
 * @memberof slate-cli.tasks
 * @static
 */
gulp.task('default', function(done) {
  runSequence('deploy', 'watch', done);
});
