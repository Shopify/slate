var findRoot = require('find-root');
var utils = require('../../includes/utils.js');
var themeRoot = findRoot(process.cwd());

module.exports = function(args, options) {
  var scriptArgs = options.manual
    ? ['deploy-manual']
    : ['deploy'];
  utils.runScript(themeRoot, scriptArgs);
};
