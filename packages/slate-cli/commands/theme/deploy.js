var findRoot = require('find-root');
var utils = require('../../includes/utils.js');

module.exports = {
  command: function(args, options) {
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
  },
  help: function() {
    utils.logHelpMsg([
      'Usage: slate deploy [--options]',
      '',
      'Build theme and replace theme files on specified environment.',
      '',
      'Options:',
      '',
      '  -e, --environment  deploy to a comma-separated list of environments',
      '  -m, --manual       disable auto-deployment of the theme files'
    ]);
  }
};
