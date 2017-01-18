const gulp = require('gulp');
const cssimport = require('gulp-cssimport');
const extReplace = require('gulp-ext-replace');
const plumber = require('gulp-plumber');
const chokidar = require('chokidar');

const config = require('./includes/config.js');
const utils = require('./includes/utilities.js');
const messages = require('./includes/messages.js');

/**
 * Concatenate css via gulp-cssimport and copys to the `/dist` folder
 *
 * @param {Array} files
 * @returns {Stream}
 * @private
 */
function processCss() {
  messages.logProcessFiles('build:css');

  return gulp.src(config.roots.css)
    .pipe(plumber(utils.errorHandler))
    .pipe(cssimport())
    .pipe(extReplace('.css.liquid', '.css'))
    .pipe(extReplace('.scss.liquid', '.scss'))
    .pipe(gulp.dest(config.dist.assets));
}

/**
 * Concatenate css via gulp-cssimport
 *
 * @function build:css
 * @memberof slate-cli.tasks.build
 * @static
 */
gulp.task('build:css', () => {
  return processCss();
});

/**
 * Watches css in the `/src` directory
 *
 * @function watch:css
 * @memberof slate-cli.tasks.watch
 * @static
 */
gulp.task('watch:css', () => {
  chokidar.watch(config.src.css, {ignoreInitial: true})
    .on('all', (event, path) => {
      messages.logFileEvent(event, path);
      processCss();
    });
});
