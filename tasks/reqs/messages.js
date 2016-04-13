var gutil = require('gulp-util');
var utils = require('./utilities.js');

var messages = {
  logFileEvent: function(event, path) {
    path = utils.separatePath(path);
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

  logProcessFiles: function(processName, fileList) {
    gutil.log('running task',
      gutil.colors.white('-'),
      gutil.colors.cyan(processName),
      gutil.colors.yellow('passing', fileList.length, 'file(s)...')
    );
  },

  logChildProcess: function(cmd, files) {
    gutil.log('running task',
      gutil.colors.bold('[child process]'),
      gutil.colors.white('-'),
      gutil.colors.cyan('theme', cmd),
      gutil.colors.yellow('passing', files.length, 'files(s)...')
    );
  },

  logDeploys: function(cmd, files) {
    var timestamp = 'Deploy complete @ ' + new Date() + '. ';
    var action = cmd === 'upload' ? 'added/changed ' : 'removed ';
    var amount = files.length + ' file(s): ';
    var fileList = files.join(', ') + '.\n';

    return timestamp + action + amount + fileList;
  }
};
module.exports = messages;
