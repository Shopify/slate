const gutil = require('gulp-util');
const _ = require('lodash');

const messages = require('./messages.js');

/** Class representing a custom reporter for @shopify/theme-lint */
export default class Reporter {
  constructor() {
    this.successes = [];
    this.failures = [];
  }

  /**
   * Pushes a valid message onto successes.
   *
   * @param {String} message
   * @param {String} file
   */
  success(message, file = null, index = null) {
    this.successes.push([message, file, index]);
  }

  /**
   * Pushes an invalid message onto failures.
   *
   * @param {String} message
   * @param {String} file
   */
  failure(message, file = null, index = null) {
    this.failures.push([message, file, index]);
  }

  /**
   * Builds string output for translation tests
   * depending on successes and failures.
   */
  output() {
    const testsRun = this.failures.length + this.successes.length;

    if (this.failures.length === 0) {
      gutil.log('Translation tests complete:',
        gutil.colors.green(`Success (${testsRun} checks run)`),
      );
    } else {
      gutil.log('Translation tests complete:',
        gutil.colors.red(`Failed (${testsRun} checks run)`),
      );

      const failureGroups = _.groupBy(this.failures, (failure) => failure[1]);

      _.forOwn(failureGroups, (failures, file) => {
        gutil.log(gutil.colors.red(`${file}:`));

        failures.map((failure) => {
          return gutil.log(failure[0]);
        });
      });

      throw new Error(messages.translationsFailed());
    }

    this.successes = this.failures = [];
  }
}
