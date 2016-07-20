var gutil = require('gulp-util');
var fs = require('fs');
var _ = require('lodash');
var Promise = require('bluebird');

/**
 * Utility & reusable functions used by our Gulp Tasks
 *
 * @summary a set of utility functions used within the gulp tasks of slate-cli
 * @namespace slate-cli.utilities
 * @memberof slate-cli
 */
var utilities = {

  /**
   * Generic error handler for streams called in `watch` tasks (used by gulp-plumber)
   *
   * @memberof slate-cli.utilities
   * @param {Error} err
   */
  errorHandler: function(err) {
    gutil.log(gutil.colors.red(err));
    this.emit('end');
  },

  /**
   * separates filename & directory from a path string & returns an object containing both.
   * @memberof slate-cli.utilities
   * @param path {String} - a string representing the path to a file
   * @returns {Object} - an object with separated `file` (the filename) and `dir` (path minus filename) properties
   */
  separatePath: function(path) {
    var tmp = path.split('/');
    return {
      file: tmp.pop(),
      dir: tmp.join('/')
    };
  },

  /**
   * Custom reporting function for scss-lint
   *
   * @memberof slate-cli.utilities
   * @param {fs} file - current file being linted
   */
  scssLintReporter: function(file) {
    if (file.scsslint.success) {
      return;
    }
    var errorMsg = file.scsslint.issues.length + ' issues found in ' + file.path;
    gutil.log(gutil.colors.yellow(errorMsg));
  },

  /**
   * Checks whether the path is a directory
   * 
   * @param path {String} - a string representing the path to a file
   * @returns {boolean}
   */
  isDirectory: function(path) {
    try {
      return fs.statSync(path).isDirectory();
    } catch (error) {
      return false;
    }
  },

  /**
   * function passed to cheerio.run - adds aria tags & other accessibility
   * based information to each svg element's markup...
   *
   * @memberof slate-cli.utilities
   * @param {Function} $ - jQuery reference
   * @param {fs} file - reference to current icon file?
   */
  processSvg: function($, file) {
    var $svg = $('svg');
    var $newSvg = $('<svg aria-hidden="true" focusable="false" role="presentation" class="icon" />');
    var fileName = file.relative.replace('.svg', '');
    var viewBoxAttr = $svg.attr('viewbox');

    // Add necessary attributes
    if (viewBoxAttr) {
      var width = parseInt(viewBoxAttr.split(' ')[2], 10);
      var height = parseInt(viewBoxAttr.split(' ')[3], 10);
      var widthToHeightRatio = width / height;
      if (widthToHeightRatio >= 1.5) {
        $newSvg.addClass('icon--wide');
      }
      $newSvg.attr('viewBox', viewBoxAttr);
    }

    // Add required classes to full color icons
    if (file.relative.indexOf('-full-color') >= 0) {
      $newSvg.addClass('icon--full-color');
    }

    $newSvg
      .addClass(fileName)
      .append($svg.contents());

    $newSvg.append($svg.contents());
    $svg.after($newSvg);
    $svg.remove();
  },

  /**
   * Factory for creating an event cache - used with a short debounce to batch any
   * file changes that occur in rapid succession during Watch tasks.
   *
   * @memberof slate-cli.utilities
   * @param {Object} options
   * @returns {eventCache} see type definition for more robust documentation
   */
  createEventCache: function(options) {
    _.defaults(options = options || {}, {
      changeEvents: ['add', 'change'],
      unlinkEvents: ['unlink']
    });

    /**
     * A cache object used for caching `[chokidar]{@link https://github.com/paulmillr/chokidar}`
     * events - used with a short `debounce` to batch any file changes that occur in rapid
     * succession during Watch tasks.
     *
     * @typedef {Object} eventCache
     * @prop {Array} change - an array for caching `add` and `change` events
     * @prop {Array} unlink - an array for caching `unlink` events
     * @prop {Function} addEvent - a function to push events to the appropriate `cache` array
     */
    return {
      change: [],
      unlink: [],

      /**
       * Pushes events to upload & remove caches for later batch deployment
       * @function addEvent
       * @memberof eventCache
       * @param {String} event - chokidar event type - only cares about `(add|change|unlink)`
       * @param {String} path - relative path to file passed via event
       */
      addEvent: function(event, path) {
        _.each(options.changeEvents, function(eventType) {
          if (event === eventType) {
            this.change.push(path);
          }
        }.bind(this));

        _.each(options.unlinkEvents, function(eventType) {
          if (event === eventType) {
            this.unlink.push(path);
          }
        }.bind(this));
      }
    };
  },

  /**
   * Debounced (320ms) delegator function passing an {@link eventCache} object
   * through to a pair of custom functions for processing batch add/change or unlink events.
   * Clears the appropriate cache array after a change/delete function has been
   * called.
   *
   * Example:
   * ```javascript
   *   // TODO:
   * ```
   *
   * @memberof slate-cli.utilities
   * @method
   * @param {eventCache} cache - a specific cache object for tracking file events
   * @param {Function} changeFn - a custom function to process the set of files that have changed
   * @param {Function} delFn - a custom function to remove the set of files that have changed from the `dist` directory
   */
  processCache: _.debounce(function(cache, changeFn, delFn) {
    if (cache.change.length) {
      changeFn(cache.change);
      cache.change = [];
    }

    if (cache.unlink.length) {
      delFn(cache.unlink);
      cache.unlink = [];
    }
  }, 320),

  /**
   * Generic handling of child_process events used to run ThemeKit commands above
   * returns a promise so we can reliably wait for this task to complete when
   * used in a gulp task chain.
   *
   * @memberof slate-cli.utilities
   * @param {child_process.spawn()} childProcess
   * @returns {Promise}
   */
  resolveShell: function(childProcess) {
    var error = ''; // stores errors from stderr events, if any occur

    return new Promise(function(resolve, reject) {
      childProcess.stdout.setEncoding('utf8');
      childProcess.stdout.on('data', function(data) {
        gutil.log(gutil.colors.white(data));
      });

      childProcess.stderr.setEncoding('utf8');
      childProcess.stderr.on('data', function(data) {
        gutil.log(gutil.colors.red(data));
        error += data;
      });

      childProcess.on('error', function(err) {
        gutil.log(gutil.colors.red('Child process failed', err));
        reject(err);
      });

      childProcess.on('close', function(code) {
        if (!error) {
          gutil.log('Process closed:',
            gutil.colors.green(mapCode(code))
          );
          resolve();
        } else {
          gutil.log('Process closed with error:',
            gutil.colors.red(mapCode(code), '\n'),
            gutil.colors.white(error)
          );
          reject(new Error(error));
        }
      });
    });
  }
};
module.exports = utilities;

/**
 * Maps process exit code to more informative explanations of the exit used by {@link resolveShell}
 * see {@link https://nodejs.org/api/process.html#process_exit_codes} for more info
 *
 * @param {Number} code - child_process exit code
 * @returns {String}
 * @private
 */
function mapCode(code) {
  var exitType;

  switch (code) {
    case 0: exitType = 'All Async Processes Complete';
      break;
    case 1: exitType = 'Uncaught Fatal Exception';
      break;
    case 2: exitType = 'Shell Error - Missing Keyword/Command/Parameter or Permission Problem';
      break;
    case 3: exitType = 'Internal JavaScript Parse Error';
      break;
    case 4: exitType = 'Internal JavaScript Evaluation Failure';
      break;
    case 5: exitType = 'Fatal Error';
      break;
    case 6: exitType = 'Non-Function Internal Exception Handler';
      break;
    case 7: exitType = 'Internal Exception Handler Run-Time Failure';
      break;
    case 8: exitType = 'Uncaught Exception';
      break;
    case 9: exitType = 'Invalid Argument';
      break;
    case 10: exitType = 'Internal JavaScript Run-Time Failure';
      break;
    case 12: exitType = 'Invalid Debug Argument';
      break;
    default: exitType = 'Signal Event or Unknown Error';
  }

  return exitType;
}
