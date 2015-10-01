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
    gulpif      = require('gulp-if'),
    changed     = require('gulp-changed');

/**
 *
 *  All paths used by tasks
 *
 */
var paths = {
  srcScss: 'src/stylesheets/**/*.*',
  srcJs: 'src/javascripts/**/*.*',
  srcAssets: [
    'src/assets/*.*',
    'src/templates/**/*.*',
    'src/snippets/*.*',
    'src/locales/*.*',
    'src/config/*.*',
    'src/layout/*.*'
  ],
  parentIncludeScss: [
    'src/stylesheets/[^_]*.*'
  ],
  parentIncludeJs: [
    'src/javascripts/[^_]*.*'
  ],
  images: 'src/images/*.{png,jpg,gif}',
  destAssets: 'dist/assets',
  config: 'config.yml',
  watch: '.themekit',
  dist: 'dist/'
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
 *   BUILD ASSETS:
 *
 *   Move all your templates, snippets, config, and assets into the dist folder
 */
gulp.task('build-assets', function () {
  gulp.src(paths.srcAssets, {base: 'src/'})
    .pipe(changed(paths.dist))
    .pipe(gulp.dest(paths.dist));
});

/**
 *   CONFIG:
 *
 *
 */
gulp.task('config', function () {
  return gulp.src(paths.config)
    .pipe(gulp.dest(paths.dist));
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
gulp.task('browser-sync', function (options) {
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
    .pipe(gulpif(argv.sync, shell('theme watch --notify=../.themekit', {cwd: paths.dist}), shell('theme watch', {cwd: paths.dist})));
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
    .pipe(shell('theme replace', {cwd: paths.dist}));
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
    .pipe(shell('theme upload', {cwd: paths.dist}));
});

/**
 *  CONCURRENT
 *
 *  Run both the gulp watch to build CSS, and images along side the theme gem watch
 *  to upload any changes to your store after being built
 */
gulp.task('concurrent', function (cb) {
  runSequence('build', 'watch', 'theme-watch', cb);
});


/**
 *  CLEAN
 *
 *  Clean up any stray files that might be created by other gulp tasks
 */
gulp.task('clean', function (cb) {
  del([
    '*.zip',
    'dist/assets/**/*',
    '!dist/assets/*.*'
  ], cb)
});

/**
 *  ZIP
 *
 *  compress theme and prepare it for the theme store
 */
gulp.task('compress', function () {
  return gulp.src(['dist/**/*.*', '!dist/config.yml'])
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
  gulp.watch(paths.srcAssets, ['build-assets']);
  gulp.watch(paths.config, ['config', 'browser-sync']);
  gulp.watch(paths.images, ['imagemin']);

  if (argv.sync) {
    if (argv.notify) {
      gulp.watch(paths.watch, function () {
        gulp.src('')
          .pipe(notify('Upload Complete'));
      }).on('change', browserSync.reload);
    } else {
      gulp.watch(paths.watch).on('change', browserSync.reload);
    }
  }
});

/**
 *  Set default tasks depending on which upload tool we're using
 */
function defaultTasks() {
  if (argv.sync) {
    return ['concurrent', 'browser-sync'];
  } else {
    return ['concurrent'];
  }
}

gulp.task('default', defaultTasks());
gulp.task('build', ['config', 'build-assets', 'concat-css', 'concat-js', 'imagemin', 'clean']);
gulp.task('deploy', function (cb) {
  runSequence('build', 'replace', cb);
});
gulp.task('zip', function (cb) {
  runSequence('build', 'compress', 'open', cb)
});
