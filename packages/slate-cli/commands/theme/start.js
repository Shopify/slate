var findRoot = require('find-root');
var utils = require('../../includes/utils.js');


module.exports = {
  command: function() {
    var themeRoot = findRoot(process.cwd());
    utils.runScript(themeRoot, ['start']);
  },
  help: function() {
    utils.logHelpMsg([
      'Usage: slate start',
      '',
      'Deploy theme, launch Browsersync in a new browser tab at http://localhost:3000 and watch for file changes.'
    ]);
  }
};
