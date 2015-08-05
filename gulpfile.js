var gulp        = require('gulp'),
    imagemin    = require('gulp-imagemin'),
    notify      = require('gulp-notify'),
    cssimport   = require('gulp-cssimport'),
    include     = require("gulp-include"),
    shell       = require('gulp-shell'),
    zip         = require('gulp-zip'),
    open        = require('gulp-open'),
    runSequence = require('run-sequence'),
    del         = require('del'),
    pkg         = require('./package.json')
    browserSync = require('browser-sync').create(),
    fs          = require('fs'),
    yaml        = require('js-yaml'),
    argv        = require('yargs').argv,
    gulpif      = require('gulp-if');

/**
 *
 *  All paths used by tasks
 *
 */
var paths = {
  srcScss: 'src/stylesheets/**/*.*',
  srcJs: 'src/javascripts/**/*.*',
  parentIncludeScss: [
    'src/stylesheets/[^_]*.*'
  ],
  parentIncludeJs: [
    'src/javascripts/*.*'
  ],
  images: 'src/images/*.{png,jpg,gif}',
  destAssets: 'assets',
  uploadFiles: [
    'config/*',
    'layout/*',
    'locales/*',
    'snippets/*',
    'templates/**/*'
  ],
  config: 'config.yml',
  watch: 'src/.themekit'
};

/**
 *   CONCAT CSS:
 *
 *   Concatenate css together into a single scss file for use in the theme
 */
gulp.task('concat-css', function () {
  gulp.src(paths.parentIncludeScss)
    .pipe(cssimport())
    .pipe(gulp.dest(paths.destAssets));
});

/**
 *   CONCAT JS:
 *
 *   Concatenate JS together into a single file for use in the theme
 */
gulp.task('concat-js', function () {
  gulp.src(paths.parentIncludeJs)
    .pipe(include())
      .on('error', console.log)
    .pipe(gulp.dest(paths.destAssets));
});

/**
 *    IMAGEMIN
 *
 *    Minify Images
 */
gulp.task('imagemin', function () {
  gulp.src(paths.images)
    .pipe(imagemin({
        optimizationLevel: 3
    }))
    .pipe(gulp.dest(paths.destAssets))
});

/**
 *  BROWSERSYNC
 */
gulp.task('browser-sync', function(options) {
  // read the shop url from the config file
  var config = yaml.safeLoad(fs.readFileSync(paths.config, 'utf8'));

  //remove this if theme gem used instead
  //of theme kit
  config = config.development;

  browserSync.init({
    proxy: config.store
  });
});

/**
 *  THEME WATCH
 *
 *  Run the theme gem watch to upload any changed files to your store
 */
gulp.task('theme-watch', function () {
  return gulp.src('')
    .pipe(gulpif(argv.themekit, shell('theme watch --notify=src/.themekit'), shell('theme watch')));
});

/**
 *  REPLACE
 *
 *  Replace your existing theme using the theme gem.  It's best
 *  to use `gulp build` before running this task so it also builds the
 *  CSS, and images first.
 */
gulp.task('replace', function () {
  gulp.src('')
    .pipe(shell('theme replace'));
});

/**
 *  UPLOAD
 *
 *  Upload your existing theme using the theme gem.  Unlike the `replace` task,
 *  the upload task doesn't remove any files from your store before uploading
 *  your theme. It's best to use `gulp build` before running this task so it also builds the
 *  CSS, and images first.
 */
gulp.task('upload', function () {
  gulp.src('')
    .pipe(shell('theme upload'));
});

/**
 *  CONCURRENT
 *
 *  Run both the gulp watch to build CSS, and images along side the theme gem watch
 *  to upload any changes to your store after being built
 */
gulp.task('concurrent', function (cb) {
  runSequence(['watch', 'theme-watch'], cb);
});

/**
 *  CLEAN
 *
 *  Clean up any stray files that might be created by other gulp tasks
 */
gulp.task('clean', function (cb) {
  del([
    '*.zip',
    'assets/**/*',
    '!assets/*.*'
  ], cb)
});

/**
 *  ZIP
 *
 *  compress theme and prepare it for the theme store
 */
gulp.task('compress', function () {
  return gulp.src(paths.uploadFiles)
    .pipe(zip(pkg.name + '.zip'))
    .pipe(gulp.dest('./'))
    .pipe(notify('Zip File Created'));
});

/**
 *  OPEN
 *
 *  Open the theme editor page for your theme when you need to mass upgrade or
 *  deploy a theme.
 *
 *  config.yml is passed in as the src for placeholder purposes only so the task
 *  will run.  Can be any file really.
 */
gulp.task('open', function () {
  gulp.src(paths.config, {read: false})
    .pipe(open('', { url : 'https://themes.shopify.com/services/internal/themes/' + pkg.name + '/edit' }));
});

/**
 *  WATCH
 */
gulp.task('watch', function () {
  gulp.watch(paths.srcScss, ['concat-css']);
  gulp.watch(paths.srcJs, ['concat-js']);
  gulp.watch(paths.config, ['config', 'browser-sync']);
  gulp.watch(paths.images, ['imagemin']);

  if (argv.themekit) {
    gulp.watch(paths.watch).on('change', browserSync.reload);
  }
});

/**
 *  Set default tasks depending on which upload tool we're using
 */
function defaultTasks() {
  if (argv.themekit) {
    return ['build', 'browser-sync', 'concurrent'];
  } else {
    return ['build', 'concurrent']
  }
}

gulp.task('default', defaultTasks());
gulp.task('build', ['concat-css', 'concat-js', 'imagemin', 'clean']);
gulp.task('deploy', ['build', 'replace']);
gulp.task('zip', ['build', 'compress', 'open']);
