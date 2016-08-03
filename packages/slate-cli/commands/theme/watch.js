var findRoot = require('find-root');
var utils = require('../../includes/utils.js');

module.exports = {
  command: function(args, options) {
    var themeRoot = findRoot(process.cwd());
    var scriptArgs = options.nosync
      ? ['watch-nosync']
      : ['watch'];
    utils.runScript(themeRoot, scriptArgs);
  },
  help: function() {
    utils.logHelpMsg([
      'Usage: slate watch [--options]',
      '',
      'Launch Browsersync in a new browser tab at http://localhost:3000 and watch for file changes.',
      '',
      'Options:',
      '',
      '  -ns, --nosync        disable Browsersync from launching'
    ]);
  }
};
