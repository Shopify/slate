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
  chokidar.watch([config.src.js, config.tasks], {ignoreInitial: true})
    .on('all', function() {
      return processLint();
    });
});

function processLint() {
  return gulp.src([config.src.js, config.tasks])
    .pipe(plumber(utils.errorHandler))
    .pipe(eslint())
    .pipe(eslint.format());
}
