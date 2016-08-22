var Promise = require('bluebird');
var stat = Promise.promisify(require('fs').stat);
var unlink = Promise.promisify(require('fs').unlink);
var path = require('path');
var _ = require('lodash');
var FeedParser = require('feedparser');
var request = require('request');
var msg = require('./messages.js');
var BinWrapper = require('bin-wrapper');
var spawn = require('child_process').spawn;
var slateRoot = path.resolve(__dirname, '..');
var themeKitBin = {};
var themeKitPath = '';
var themeKitRepo = 'https://github.com/Shopify/themekit';

/**
 * @module ThemeKit
 *
 */
var themeKit = {

  /**
   * Uses BinWrapper instance and executes version command
   * to test the ThemeKit binary.
   *
   * @returns {Promise:String} - The ThemeKit installation
   */
  install: function() {
    return test()
      .then(function(exists) {
        if (!exists) {
          return Promise.resolve();
        }

        return getPath()
          .then(function(binPath) {
            return unlink(binPath);
          });
      })
      .then(function() {
        return get();
      })
      .then(function(bin) {
        return new Promise(function(resolve, reject) {
          process.stdout.write(msg.fetchingDependencies());

          bin.run(['version'], function(err) {
            if (err) {
              reject(err);
            } else {
              resolve(getPath());
            }
          });
        });
      });
  },

  /**
   * Uses child_process to spawn a new thread and
   * executes the command with the local ThemeKit
   * binary.
   *
   * @param args {Object} - The command and additional args to execute.
   * @returns {Promise} - The child_process stream
   */
  commands: function(args) {
    var error = '';

    return test()
      .then(function(exists) {
        if (exists) {
          return getPath();
        } else {
          throw new Error(msg.missingDependencies());
        }
      })
      .then(function(binPath) {
        var childProcess = spawn(binPath, args);

        return new Promise(function(resolve, reject) {
          childProcess.stdout.setEncoding('utf8');
          childProcess.stdout.on('data', function(data) {
            process.stdout.write(data);
          });

          childProcess.stderr.on('data', function(data) {
            process.stdout.write(data);
            error += data;
          });

          childProcess.on('error', function(err) {
            process.stdout.write(err);
            reject(err);
          });

          childProcess.on('close', function() {
            if (error) {
              reject(new Error(error));
            } else {
              resolve();
            }
          });
        });
      });
  }
};

module.exports = themeKit;

/**
 * Initializes BinWrapper to have a single instance.
 *
 * @returns {Object} - BinWrapper instance for themeKitBin
 *
 * @private
 */
function init() {
  if (_.isEmpty(themeKitBin)) {
    themeKitBin = new BinWrapper();
  }

  return themeKitBin;
}

/**
 * Uses BinWrapper to fetch the ThemeKit binary based on
 * system and architecture. The binary gets stored in
 * slate-cli bin.
 *
 * @returns {Promise:Object} - BinWrapper instance for ThemeKit
 *
 * @private
 */
function get() {
  var bin = init();

  return getLatestRelease()
    .then(function(latestRelease) {
      return bin
        .src(latestRelease + '/darwin-amd64.zip', 'darwin')
        .src(latestRelease + '/linux-386.zip', 'linux')
        .src(latestRelease + '/linux-amd64.zip', 'linux', 'x64')
        .src(latestRelease + '/windows-386.zip', 'win32')
        .src(latestRelease + '/windows-amd64.zip', 'win32', 'x64')
        .dest(path.join(slateRoot, '/bin'))
        .use(process.platform === 'win32' ? 'theme.exe' : 'theme');
    });
}

/**
 * Resolves the path to local ThemeKit binary.
 *
 * @returns {Promise:String} - The path to ThemeKit
 *
 * @private
 */
function getPath() {
  if (themeKitPath) {
    return Promise.resolve(themeKitPath);
  }

  return get()
    .then(function(bin) {
      themeKitPath = bin.path();
      return themeKitPath;
    });
}

/**
 * Fetches releases based on Atom GitHub feed.
 *
 * @returns {Promise:Array} - All releases available for URL
 *
 * @private
 */
function getReleases(feedUrl) {
  var req = request(feedUrl);
  var feedparser = new FeedParser();
  var items = [];

  return new Promise(function(resolve, reject) {
    req.on('error', function(err) {
      reject(err);
    });

    req.on('response', function(res) {
      if (res.statusCode !== 200) {
        reject(new Error('Bad status code'));
      }

      this.pipe(feedparser);
    });

    feedparser.on('error', function(err) {
      reject(err);
    });

    feedparser.on('readable', function() {
      var item;

      while (item = this.read()) { //eslint-disable-line no-cond-assign
        items.push(item);
      }
    });

    feedparser.on('end', function() {
      resolve(items);
    });
  });
}

/**
 * Fetches releases based on Atom GitHub feed. Gets the
 * latest release of ThemeKit based on the feed.
 *
 * @returns {Promise:String} - Download URL for latest ThemeKit release
 *
 * @private
 */
function getLatestRelease() {
  return getReleases(themeKitRepo + '/releases.atom')
    .then(function(releases) {
      var base = themeKitRepo + '/releases/download/';
      var latestTag = releases.length > 0 ? releases[0].title : '0.4.2';
      var latestRelease = base + latestTag;

      return latestRelease;
    });
}

/**
 * Tests if ThemeKit binary exists.
 *
 * @returns {Promise:Boolean} - If ThemeKit exists
 *
 * @private
 */
function test() {
  var exists = true;

  return getPath()
    .then(function(binPath) {
      return stat(binPath);
    })
    .catch(function(err) {
      if (err.code === 'ENOENT') {
        exists = false;
      } else {
        throw new Error(err);
      }
    })
    .then(function() {
      return exists;
    });
}
