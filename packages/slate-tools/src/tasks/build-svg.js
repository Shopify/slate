const gulp = require('gulp');
const vinylPaths = require('vinyl-paths');
const del = require('del');
const size = require('gulp-size');
const chokidar = require('chokidar');
const svgmin = require('gulp-svgmin');
const cheerio = require('gulp-cheerio');
const extReplace = require('gulp-ext-replace');
const plumber = require('gulp-plumber');

const config = require('./includes/config.js');
const utils = require('./includes/utilities.js');
const messages = require('./includes/messages.js');

/**
 * Processing for SVGs prior to deployment - adds accessibility markup, and converts
 * the file to a liquid snippet.
 *
 * @param {String|Array} files - glob/array of files to match & send to the stream
 * @returns {Stream}
 * @private
 */
function processIcons(files) {
  messages.logProcessFiles('build:svg');
  return gulp.src(files)
    .pipe(plumber(utils.errorHandler))
    .pipe(svgmin(config.plugins.svgmin))
    .pipe(cheerio(config.plugins.cheerio))
    .pipe(extReplace('.liquid'))
    .pipe(size({
      showFiles: true,
      pretty: true,
    }))
    .pipe(gulp.dest(config.dist.snippets));
}

/**
 * Cleanup/remove liquid snippets from the `dist` directory during watch tasks if
 * any underlying SVG files in the `src` folder have been removed.
 *
 * @param {String|Array} files - glob/array of files to match & send to the stream
 * @returns {Stream}
 * @private
 */
function removeIcons(files) {
  messages.logProcessFiles('remove:svg');
  const mapFiles = files.map((file) => {
    const distFile = file.replace('src/icons', 'dist/snippets');
    const snippetFile = distFile.replace('.svg', '.liquid');
    return snippetFile;
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
 * Pre-processing for svg icons
 *
 * @function build:svg
 * @memberof slate-cli.tasks.build
 * @static
 */
gulp.task('build:svg', () => {
  return processIcons(config.src.icons);
});

/**
 * Watches source svg icons for changes...
 *
 * @function watch:svg
 * @memberof slate-cli.tasks.watch
 * @static
 */
gulp.task('watch:svg', () => {
  const cache = utils.createEventCache();

  chokidar.watch([config.src.icons], {ignoreInitial: true})
    .on('all', (event, path) => {
      messages.logFileEvent(event, path);
      cache.addEvent(event, path);
      utils.processCache(cache, processIcons, removeIcons);
    });
});
