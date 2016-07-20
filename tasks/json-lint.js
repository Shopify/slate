var gulp = require('gulp');
var linter = require('gulp-jsonlint');
var chokidar = require('chokidar');

var config = require('./includes/config.js');


gulp.task('lint:json', function() {
  return processLint();
});

gulp.task('watch:json-lint', function() {
  chokidar.watch(config.src.json, {ignoreInitial: true})
    .on('all', function() {
      return processLint();
    });
});

function processLint() {
  return gulp.src(config.src.json)
    .pipe(linter())
    .pipe(linter.reporter());
}
