var gulp = require('gulp');
var eslint = require('gulp-eslint');
var plumber = require('gulp-plumber');
var chokidar = require('chokidar');
var fs = require('fs');

var config = require('./reqs/config.js');
var utils = require('./reqs/utilities.js');
var messages = require('./reqs/messages.js');

gulp.task('build:eslint', function() {
  return processEsLint();
});

gulp.task('watch:eslint', function() {
  chokidar.watch([config.paths.srcJs], {ignoreInitial: true})
    .on('all', function(event, path) {
      messages.logFileEvent(event, path);
      return processEsLint();
    });
});


function processEsLint() {
  return gulp.src(config.paths.srcJs)
    .pipe(plumber(utils.errorHandler))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.format('json', fs.createWriteStream(config.paths.eslintReport)));
}
