var findRoot = require('find-root');
var utils = require('../../includes/utils.js');

module.exports = function(args, options) {
  var themeRoot = findRoot(process.cwd());

  if (options.environment) {
    // needed to pass arguments to npm scripts when calling `run` programatically
    // eslint-disable-next-line no-process-env
    process.env.tkEnvironments = options.environment;
  }

  var scriptArgs = options.manual
    ? ['deploy-manual']
    : ['deploy'];

  utils.runScript(themeRoot, scriptArgs);
};
