const gulp = require('gulp');
const plumber = require('gulp-plumber');
const chokidar = require('chokidar');
const vinylPaths = require('vinyl-paths');
const del = require('del');
const size = require('gulp-size');

const config = require('./includes/config.js');
const utils = require('./includes/utilities.js');
const messages = require('./includes/messages.js');

const assetsPaths = [
  config.src.assets,
  config.src.templates,
  config.src.sections,
  config.src.snippets,
  config.src.locales,
  config.src.config,
  config.src.layout,
];

/**
 * Copies assets to the `/dist` directory
 *
 * @param {Array} files
 * @returns {Stream}
 * @private
 */
function processAssets(files) {
  messages.logProcessFiles('build:assets');
  return gulp.src(files, {base: config.src.root})
    .pipe(plumber(utils.errorHandler))
    .pipe(size({
      showFiles: true,
      pretty: true,
    }))
    .pipe(gulp.dest(config.dist.root));
}

/**
 * Deletes specified files
 *
 * @param {Array} files
 * @returns {Stream}
 * @private
 */
function removeAssets(files) {
  messages.logProcessFiles('remove:assets');

  const mapFiles = files.map((file) => {
    const distFile = file.replace(config.src.root, config.dist.root);
    return distFile;
  });

  return gulp.src(mapFiles)
    .pipe(plumber(utils.errorHandler))
    .pipe(vinylPaths(del))
    .pipe(size({
      showFiles: true,
      pretty: true,
    }));
}

/**
 * Copies assets to the `/dist` directory
 *
 * @function build:assets
 * @memberof slate-cli.tasks.build
 * @static
 */
gulp.task('build:assets', () => {
  return processAssets(assetsPaths);
});

/**
 * Watches assets in the `/src` directory
 *
 * @function watch:assets
 * @memberof slate-cli.tasks.watch
 * @static
 */
gulp.task('watch:assets', () => {
  const eventCache = utils.createEventCache();

  chokidar.watch(assetsPaths, {
    ignored: /(^|[/\\])\../,
    ignoreInitial: true,
  }).on('all', (event, path) => {
    messages.logFileEvent(event, path);
    eventCache.addEvent(event, path);
    utils.processCache(eventCache, processAssets, removeAssets);
  });
});
