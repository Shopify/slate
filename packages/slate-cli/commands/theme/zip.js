var findRoot = require('find-root');
var utils = require('../../includes/utils.js');

module.exports = {
  command: function() {
    var themeRoot = findRoot(process.cwd());
    utils.runScript(themeRoot, ['zip']);
  },
  help: function() {
    utils.logHelpMsg([
      'Usage: slate zip',
      '',
      'Build theme and zip compiled files.',
      '',
      'The zip file can be found within an upload folder that is generated within your theme project root folder.'
    ]);
  }
};
