const gulp = require('gulp');
const del = require('del');
const zip = require('gulp-zip');
const size = require('gulp-size');
const plumber = require('gulp-plumber');

const config = require('./includes/config.js');
const utils = require('./includes/utilities.js');

/**
 * Clean up build dirs/files whenever doing a full/clean (re)build.
 *
 * @function build:clean
 * @memberof slate-cli.tasks.build
 * @static
 */
gulp.task('clean', () => {
  return del(['upload', 'dist']);
});

/**
 * Compress theme and build a shopify-compatible `.zip` file for uploading to store
 *
 * @function compress
 * @memberof slate-cli.tasks.deploy
 * @static
 */
gulp.task('compress', () => {
  const distFiles = `${config.dist.root}**/*`;
  const ignoreConfig = `!${config.dist.root}config.yml`;

  return gulp.src([distFiles, ignoreConfig])
    .pipe(plumber(utils.errorHandler))
    .pipe(zip(`${config.packageJson.name}.zip` || 'theme.zip'))
    .pipe(size({showFiles: true, pretty: true}))
    .pipe(gulp.dest('./upload/'));
});
