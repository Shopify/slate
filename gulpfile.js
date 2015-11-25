var gulp        = require('gulp');
var imagemin    = require('gulp-imagemin');
var notify      = require('gulp-notify');
var cssimport   = require('gulp-cssimport');
var include     = require("gulp-include");
var shell       = require('gulp-shell');
var zip         = require('gulp-zip');
var open        = require('gulp-open');
var runSequence = require('run-sequence');
var del         = require('del');
var pkg         = require('./package.json')
var browserSync = require('browser-sync').create();
var fs          = require('fs');
var yaml        = require('js-yaml');
var argv        = require('yargs').argv;
var gulpif      = require('gulp-if');
var svgSprite   = require('gulp-svg-sprite');
var changed     = require('gulp-changed');
var cheerio     = require('gulp-cheerio');

/**
 *  PATHS
 *
 *  All paths used by tasks
 */
var paths = {
  srcScss: 'src/stylesheets/**/*.*',
  srcJs: 'src/javascripts/**/*.*',
  srcIcons: 'src/icons/*.svg',
  tempIcons: 'src/icons/temp', // so we never overwrite original files
  srcIconsTemp: 'src/icons/temp/*.svg',
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
  destSnippets: 'dist/snippets',
  config: 'config.yml',
  watch: '.themekit',
  dist: 'dist/'
};

/**
 *  CONCAT CSS
 *
 *  Concatenate css together into a single scss file for use in the theme
 */
gulp.task('concat-css', function () {
  return gulp.src(paths.parentIncludeScss)
    .pipe(cssimport())
    .pipe(gulp.dest(paths.destAssets));
});

/**
 *  CONCAT JS
 *
 *  Concatenate JS together into a single file for use in the theme
 */
gulp.task('concat-js', function () {
  return gulp.src(paths.parentIncludeJs)
    .pipe(include())
      .on('error', console.log)
    .pipe(gulp.dest(paths.destAssets));
});

/**
 *  SVG CLASSES
 *
 *  Make sure all icons have class="icon"
 *  Files with `-full-color` in their name will also get
 *  class="icon--full-color" so CSS cannot override them
 */
gulp.task('icon-class', function (callback) {
  return gulp.src(paths.srcIcons)
    .pipe(changed(paths.tempIcons))
    .pipe(cheerio({
      run: function ($, file) {
        var $svg = $('svg');
        if (file.relative.indexOf('-full-color') >= 0){
          $svg.addClass('icon icon--full-color')
        }
        $svg.addClass('icon');
     }
   }))
   .pipe(gulp.dest(paths.tempIcons));
});

/**
 *  SVG SPRITES
 *
 *  Create an svg sprite from all svg icon files
 *  Runs after icon-class task
 */
gulp.task('svgicons', ['icon-class'], function() {
  return gulp.src(paths.srcIconsTemp)
    .pipe(svgSprite({
      svg: {
        namespaceClassnames: false
      },
      mode: {
        symbol: {
          inline: true,
          sprite: 'icon-sprite.svg.liquid',
          dest: '.'
        }
      }
    }))
      .on('error', function(error){
        console.log('Error with svgicons task. Potentially trying to parse an empty file. Full error below.');
        console.log(error);
      })
    .pipe(gulp.dest(paths.destSnippets));
});

/**
 *  BUILD ASSETS
 *
 *  Move all your templates, snippets, config, and assets into the dist folder
 */
gulp.task('build-assets', function () {
  return gulp.src(paths.srcAssets, {base: 'src/'})
    .pipe(changed(paths.dist))
    .pipe(gulp.dest(paths.dist));
});

/**
 *  CONFIG
 *
 *  Move config file to `dist/` for theme-watch to use
 */
gulp.task('config', function () {
  return gulp.src(paths.config)
    .pipe(gulp.dest(paths.dist));
});

/**
 *  IMAGEMIN
 *
 *  Minify Images
 */
gulp.task('imagemin', function () {
  return gulp.src(paths.images)
    .pipe(imagemin({
        optimizationLevel: 3
    }))
    .pipe(gulp.dest(paths.destAssets))
});

/**
 *  BROWSERSYNC
 *
 *  Setup proxy server to enable live reload when `--sync` flag is used
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
  runSequence('clean', 'build', 'watch', 'theme-watch', cb);
});

/**
 *  CLEAN
 *
 *  Scrap the dist folder and any zips lying around
 */
gulp.task('clean', function (cb) {
  del([ '*.zip', 'dist' ], cb)
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
  gulp.watch(paths.srcIcons, ['svgicons']);
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
 *  DEFAULT TASKS
 *
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
gulp.task('build', ['config', 'build-assets', 'svgicons', 'concat-css', 'concat-js', 'imagemin']);
gulp.task('deploy', function (cb) {
  runSequence('clean', 'build', 'replace', cb);
});
gulp.task('zip', function (cb) {
  runSequence('clean', 'build', 'compress', 'open', cb)
});
