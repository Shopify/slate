const gulp = require('gulp');
const uglify = require('gulp-uglify');
const include = require('gulp-include');
const plumber = require('gulp-plumber');
const chokidar = require('chokidar');

const config = require('./includes/config.js');
const messages = require('./includes/messages.js');
const utils = require('./includes/utilities.js');

function processThemeJs() {
  messages.logProcessFiles('build:js');
  return gulp.src([config.roots.js, `!${config.roots.vendorJs}`])
    .pipe(plumber(utils.errorHandler))
    .pipe(include())
    .pipe(gulp.dest(config.dist.assets));
}

function processVendorJs() {
  messages.logProcessFiles('build:vendor-js');
  return gulp.src(config.roots.vendorJs)
    .pipe(plumber(utils.errorHandler))
    .pipe(include())
    .pipe(uglify({
      mangle: true,
      compress: true,
      preserveComments: 'license',
    }))
    .pipe(gulp.dest(config.dist.assets));
}

gulp.task('build:js', () => {
  processThemeJs();
});

gulp.task('watch:js', () => {
  chokidar.watch([config.src.js, `!${config.roots.vendorJs}`, `!${config.src.vendorJs}`], {ignoreInitial: true})
    .on('all', (event, path) => {
      messages.logFileEvent(event, path);
      processThemeJs();
    });
});

gulp.task('build:vendor-js', () => {
  processVendorJs();
});

gulp.task('watch:vendor-js', () => {
  chokidar.watch([config.roots.vendorJs, config.src.vendorJs], {ignoreInitial: true})
    .on('all', (event, path) => {
      messages.logFileEvent(event, path);
      processVendorJs();
    });
});
