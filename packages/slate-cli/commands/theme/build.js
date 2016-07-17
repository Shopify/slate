var findRoot = require('find-root');
var utils = require('../../includes/utils.js');

module.exports = function() {
  var themeRoot = findRoot(process.cwd());
  utils.runScript(themeRoot, ['build']);
};
