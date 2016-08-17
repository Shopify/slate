var gutil = require('gulp-util');

var messages = {
  logFileEvent: function(event, path) {
    path = separatePath(path);
    gutil.log('change in',
      gutil.colors.magenta(path.dir),
      gutil.colors.white('-'),
      gutil.colors.cyan(event),
      gutil.colors.yellow(path.file)
    );
  },

  logTransferDone: function() {
    gutil.log('Transfer Complete:',
      gutil.colors.green('File changes successfully synced to store')
    );
  },

  logProcessFiles: function(processName) {
    gutil.log('running task',
      gutil.colors.white('-'),
      gutil.colors.cyan(processName)
    );
  },

  logChildProcess: function(cmd) {
    gutil.log('running task',
      gutil.colors.bold('[child process]'),
      gutil.colors.white('-'),
      gutil.colors.cyan('theme', cmd)
    );
  },

  logDeploys: function(cmd, files) {
    var timestamp = 'Deploy complete @ ' + new Date() + '. ';
    var action = cmd === 'upload' ? 'added/changed ' : 'removed ';
    var amount = files.length + ' file(s): ';
    var fileList = files.join(', ') + '.\n';

    return timestamp + action + amount + fileList;
  },

  logBundleJs: function() {
    gutil.log('Updating JS Bundle...');
  },

  configChange: function() {
    return 'Changes to ThemeKit Config Detected: You may need to quit <slate watch>' +
      ' and run a full <slate deploy> as a result.';
  },

  deployTo: function(environment) {
    gutil.log('Initiating deploy to', gutil.colors.bold(environment));
  },

  allDeploysComplete: function() {
    gutil.log('Multiple environments:',
      gutil.colors.green('Deploy completed for all environments in series')
    );
  }
};

module.exports = messages;

/**
 * Separates filename and directory from a path string. Returns an object containing both.
 *
 * @param path {String} - a string representing the path to a file
 * @returns {Object} - an object with separated `file` (the filename) and `dir` (path minus filename) properties
 * @private
 */
function separatePath(path) {
  var tmp = path.split('/');
  return {
    file: tmp.pop(),
    dir: tmp.join('/')
  };
}
