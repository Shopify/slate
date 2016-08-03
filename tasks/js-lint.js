var gulp = require('gulp');
var eslint = require('gulp-eslint');
var plumber = require('gulp-plumber');
var chokidar = require('chokidar');

var config = require('./includes/config.js');
var utils = require('./includes/utilities.js');


gulp.task('lint:js', function() {
  return processLint();
});

gulp.task('watch:js-lint', function() {
  chokidar.watch([config.src.js, config.src.jsSections, config.tasks], {ignoreInitial: true})
    .on('all', function() {
      return processLint();
    });
});

function processLint() {
  return gulp.src([config.src.js, config.src.jsSections, config.tasks])
    .pipe(plumber(utils.errorHandler))
    .pipe(eslint())
    .pipe(eslint.format())
    // fixes weird issue with linting during watch
    .on('data', function() {}); // eslint-disable-line no-empty-function
}
