var Promise = require('bluebird');
var stat = Promise.promisify(require('fs').stat);
var path = require('path');
var msg = require('./messages.js');
var BinWrapper = require('bin-wrapper');
var spawn = require('child_process').spawn;
var slateRoot = path.resolve(__dirname, '..');
// https://github.com/Shopify/themekit/releases.atom:
// fetch feed, parse for release version number, and append to base
var base = 'https://github.com/Shopify/themekit/releases/download/0.3.6';

module.exports = {

  /**
   * Uses BinWrapper to fetch the ThemeKit binary based on
   * system and architecture. The binary gets stored in
   * slate-cli bin.
   *
   * @returns {Object} - BinWrapper instance for ThemeKit
   */
  get: function() {
    return new BinWrapper()
      .src(base + '/darwin-amd64.zip', 'darwin')
      .src(base + '/linux-386.zip', 'linux')
      .src(base + '/linux-amd64.zip', 'linux', 'x64')
      .src(base + '/windows-386.zip', 'win32')
      .src(base + '/windows-amd64.zip', 'win32', 'x64')
      .dest(path.join(slateRoot, '/bin'))
      .use(process.platform === 'win32' ? 'theme.exe' : 'theme');
  },

  /**
   * Uses BinWrapper instance and executes version command
   * to test the ThemeKit binary.
   *
   * @returns {Promise} - The ThemeKit installation
   */
  install: function() {
    var installer = this.get();

    return new Promise(function(resolve, reject) {
      installer.run(['version'], function(error) {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  },

  test: function() {
    return stat(this.path())
      .catch(function(err) {
        if (err.code === 'ENOENT') {
          process.stdout.write(msg.missingDependencies());
          process.exit(5); // eslint-disable-line no-process-exit
        } else {
          throw new Error(err);
        }
      });
  },

  /**
   * Resolves the path to local ThemeKit binary.
   *
   * @returns {String} - The path to ThemeKit
   */
  path: function() {
    return path.resolve(this.get().path());
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
    var childProcess = spawn(this.path(), args);

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
  }
};
