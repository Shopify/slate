var findRoot = require('find-root');
var utils = require('../../includes/utils.js');

module.exports = function(args, options) {
  var themeRoot = findRoot(process.cwd());
  var scriptArgs = options.manual
    ? ['deploy-manual']
    : ['deploy'];
  utils.runScript(themeRoot, scriptArgs);
};
