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
var del = require('del');
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
 * __dependencies:__  `[build:scss, build:js, build:assets, build:config, build:svg, build:img]`
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
    ['build:scss', 'build:js', 'build:assets', 'build:config'],
    ['build:svg', 'build:img'],
    done
  );
});

/**
 * Clean up build dirs/files whenever doing a full/clean (re)build.
 * @function build:clean
 * @memberof slate-cli.tasks.build
 * @static
 */
gulp.task('build:clean', function() {
  return del(['*.zip', 'dist']);
});

/**
 * Simple wrapper around src & dist watchers
 * @summary Monitor your codebase for file changes and take the appropriate action
 * @function watch
 * @memberof slate-cli.tasks.watch
 * @static
 */
gulp.task('watch', ['watch:src', 'watch:dist']);

/**
 * Does a full (re)build followed by a full deploy, cleaning existing files on the
 * remote server and replacing them with the full set of files pushed to `dist` in
 * the build
 *
 * @summary Deploy your built files to the Shopify Store set in `slate-cli.config`
 * @function deploy
 * @memberof slate-cli.tasks.deploy
 * @static
 */
gulp.task('deploy', function(done) {
  runSequence('build:clean', 'build', 'deploy:replace', done);
});

/**
 * Provides a simple kickoff for manual uploads of themes by clean/(re)building `dist`
 * zipping the files, and opening up the appropriate URL for manual upload of theme
 * files
 *
 * @function deploy:manual
 * @memberof slate-cli.tasks.deploy
 * @static
 */
gulp.task('deploy:manual', function(done) {
  runSequence('build:clean', 'build', 'deploy:zip', 'deploy:open-sfe', done);
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
gulp.task('default', getDefaultTasks());

function getDefaultTasks() {
  var tasks = ['build', 'watch'];
  if (argv.sync) {
    tasks.push('deploy:sync-reload');
  }
  return tasks;
}
