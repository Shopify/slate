var findRoot = require('find-root');
var utils = require('../../includes/utils.js');

module.exports = {
  command: function() {
    var themeRoot = findRoot(process.cwd());
    utils.runScript(themeRoot, ['build']);
  },
  help: function() {
    utils.logHelpMsg([
      'Usage: slate build',
      '',
      'Compile theme files and assets into a Shopify theme.'
    ]);
  }
};
