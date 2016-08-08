/* eslint-disable no-sync */

var gulp = require('gulp');
var plumber = require('gulp-plumber');
var chokidar = require('chokidar');
var vinylPaths = require('vinyl-paths');
var fs = require('fs');
var del = require('del');
var size = require('gulp-size');
var _ = require('lodash');

var config = require('./includes/config.js');
var utils = require('./includes/utilities.js');
var messages = require('./includes/messages.js');

/**
 * Concat component files for each folder in `src/sections` into a single
 * `<section>.liquid` file and write to `dist/sections`.
 *
 * @function build:sections
 * @memberof slate-cli.tasks.build
 * @static
 */
gulp.task('build:sections', function() {
  var sectionsDir = config.src.sections;

  if (fs.existsSync(sectionsDir)) { // eslint-disable-line node/no-deprecated-api
    processAssets(sectionsDir);
  }
});

/**
 * Watch for changes in `src/sections`, process or remove assets as necessary
 *
 * @function watch:sections
 * @memberof slate-cli.tasks.watch
 * @static
 */
gulp.task('watch:sections', function() {
  var eventCache = utils.createEventCache({
    changeEvents: ['add', 'change', 'unlink'],
    unlinkEvents: ['unlinkDir']
  });

  chokidar.watch(config.src.sections, {ignoreInitial: true})
    .on('all', function(event, path) {
      messages.logFileEvent(event, path);
      eventCache.addEvent(event, path);
      utils.processCache(eventCache, processAssets, removeAssets);
    });
});


/**
 * Concat liquid/css/js/json section files from `src` to single liquid file in dist
 *
 * @param {String|Array} files - root section dir from build, array of files from watch
 * @returns {Stream}
 * @private
 */
function processAssets(files) {
  var sectionList = [];

  if (_.isArray(files)) {
    _.each(files, function(file) {
      var pathArray = file.split('/');
      var dirname = pathArray[pathArray.length - 2];
      if (!_.includes(sectionList, dirname)) {
        sectionList.push(dirname);
      }
    });
  } else {
    sectionList = fs.readdirSync(files);
  }

  if (!fs.existsSync(config.dist.root)) { // eslint-disable-line node/no-deprecated-api
    fs.mkdirSync(config.dist.root);
  }
  if (!fs.existsSync(config.dist.sections)) { // eslint-disable-line node/no-deprecated-api
    fs.mkdirSync(config.dist.sections);
  }

  messages.logProcessFiles('build:sections');
  _.each(compileSections(sectionList), function(section) {
    if (typeof section !== 'undefined') {
      fs.writeFileSync(section.filename, section.content);
    }
  });
}

/**
 * @param {String} files
 * @returns {Stream}
 * @private
 */
function removeAssets(files) {
  files = files.map(function(file) {
    file = file.replace(config.src.root, config.dist.root);
    return file + '.liquid';
  });

  messages.logProcessFiles('remove:sections');
  return gulp.src(files)
    .pipe(plumber(utils.errorHandler))
    .pipe(vinylPaths(del))
    .pipe(size({showFiles: true, pretty: true}));
}

/**
 * Reads files from the provided section paths and concats their contents into a
 * "compiled" map of sections to be written to the `dist` directory.
 *
 * @param {Array} sectionList
 * @returns {Array}
 * @private
 */
function compileSections(sectionList) {
  var sections = [];

  _.each(sectionList, function(section, i) {
    var path = config.src.sectionsDir + section + '/';
    var sectionFiles = [];

    if (!utils.isDirectory(path)) {
      return;
    }

    sectionFiles = fs.readdirSync(path);
    sections[i] = {
      filename: config.dist.sections + section + '.liquid',
      content: concatContent(sectionFiles, path)
    };
  });

  return sections;
}

/**
 * Concats the files for a particular section, in the appropriate order, skipping
 * any empty files along the way.
 *
 * @param {Array} files
 * @param {String} path
 * @returns {String}
 */
function concatContent(files, path) {
  var contents = [];
  var hasComments = /\s*(<style>)?\s*(\/\*(.*?\s*?)*?\*\/\s*)*(<\/style>)?/;
  var isEmpty = /^\s*$/;

  _.each(files, function(file) {
    var tempContents = fs.readFileSync(path + file, 'utf-8');
    var tempMatch;

    if (file === 'schema.json') {
      contents[0] = '{% schema %}\n' + tempContents + '{% endschema %}\n';

    } else if (file === 'style.liquid') {
      tempMatch = tempContents.replace(hasComments, '');
      contents[1] = isEmpty.test(tempMatch)
        ? null : tempContents;

    } else if (file === 'template.liquid') {
      contents[2] = tempContents;

    } else if (file === 'javascript.js') {
      tempMatch = tempContents.replace(hasComments, '');
      contents[3] = isEmpty.test(tempMatch)
        ? null : '{% javascript %}\n' + tempContents + '{% endjavascript %}\n';
    }
  });
  _.remove(contents, function(item) { return !item; });

  return contents.join('\n');
}
