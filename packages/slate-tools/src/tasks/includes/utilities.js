const gutil = require('gulp-util');
const _ = require('lodash');
const Promise = require('bluebird');

let errors = [];

/**
 * Utility and reusable functions used by our Gulp Tasks
 *
 * @summary a set of utility functions used within the gulp tasks of slate-cli
 * @namespace slate-cli.utilities
 * @memberof slate-cli
 */
const utilities = {

  /**
   * Handles the output for any errors that might have been captured
   * during the build and zip Gulp tasks.
   *
   * @memberof slate-cli.utilities
   */
  outputErrors: () => {
    if (!errors.length) {
      return;
    }

    gutil.log(gutil.colors.red(`There were errors during the build:\n`));

    errors.forEach((err) => {
      gutil.log(gutil.colors.red(err));
    });

    errors = [];
  },

  /**
   * Generic error handler for streams called in `watch` tasks (used by gulp-plumber).
   * Any error that is thrown inside of a task is added to the errors array.
   *
   * @memberof slate-cli.utilities
   * @param {Error} err
   */
  errorHandler: (err) => {
    gutil.log(gutil.colors.red(err));
    errors.push(err);

    this.emit('end');
  },

  /**
   * Executes an array of promises in series
   *
   * @param promiseArrayFactory {Function} - an array of promise factories
   * @returns {Promise} - promise.all() style array of results from each promise
   */
  promiseSeries: (promiseArrayFactory) => {
    const results = [];

    return Promise.each(promiseArrayFactory, (factory) => {
      const result = factory();
      results.push(result);
      return result;
    }).thenReturn(results).all();
  },

  /**
   * Function passed to cheerio.run - adds aria tags & other accessibility
   * based information to each svg element's markup...
   *
   * @memberof slate-cli.utilities
   * @param {Function} $ - jQuery reference
   * @param {fs} file - reference to current icon file?
   */
  processSvg: ($, file) => {
    var $svg = $('svg'); // eslint-disable-line no-var
    var $newSvg = $('<svg aria-hidden="true" focusable="false" role="presentation" class="icon" />'); // eslint-disable-line no-var
    var fileName = file.relative.replace('.svg', ''); // eslint-disable-line no-var
    var viewBoxAttr = $svg.attr('viewbox'); // eslint-disable-line no-var

    // Add necessary attributes
    if (viewBoxAttr) {
      var width = parseInt(viewBoxAttr.split(' ')[2], 10); // eslint-disable-line no-var
      var height = parseInt(viewBoxAttr.split(' ')[3], 10); // eslint-disable-line no-var
      var widthToHeightRatio = width / height; // eslint-disable-line no-var
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
  createEventCache: (options) => {
    _.defaults(options = options || {}, { // eslint-disable-line no-param-reassign
      changeEvents: ['add', 'change'],
      unlinkEvents: ['unlink'],
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
       *
       * @function addEvent
       * @memberof eventCache
       * @param {String} event - chokidar event type - only cares about `(add|change|unlink)`
       * @param {String} path - relative path to file passed via event
       */
      addEvent: function(event, path) { // eslint-disable-line babel/object-shorthand
        _.each(options.changeEvents, (eventType) => {
          if (event === eventType) {
            this.change.push(path);
          }
        });

        _.each(options.unlinkEvents, (eventType) => {
          if (event === eventType) {
            this.unlink.push(path);
          }
        });
      },
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
  processCache: _.debounce((cache, changeFn, delFn) => {
    if (cache.change.length) {
      changeFn(cache.change);
      cache.change = [];
    }

    if (cache.unlink.length) {
      delFn(cache.unlink);
      cache.unlink = [];
    }
  }, 320),
};

module.exports = utilities;
