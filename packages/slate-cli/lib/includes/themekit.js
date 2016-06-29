var path = require('path');
var BinWrapper = require('bin-wrapper');
var spawn = require('child_process').spawn;
var slateRoot = path.resolve(__dirname, '../..');
// https://github.com/Shopify/themekit/releases.atom:
// fetch feed, parse for release version number, and append to base
var base = 'https://github.com/Shopify/themekit/releases/download/0.3.6';

module.exports = {
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
  path: function() {
    return path.resolve(this.get().path());
  },
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
        if (!error) {
          resolve();
        } else {
          reject(new Error(error));
        }
      });
    });
  }
};
