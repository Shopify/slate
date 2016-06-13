var findRoot = require('find-root');
var utils = require('../../includes/utils.js');
var themeRoot = findRoot(process.cwd());

module.exports = function() {
  utils.runScript(themeRoot, ['test']);
};
