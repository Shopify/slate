var findRoot = require('find-root');
var utils = require('../../includes/utils.js');

module.exports = {
  command: function(args, options) {
    var themeRoot = findRoot(process.cwd());

    if (options.environment) {
      process.env.tkEnvironments = options.environment; // eslint-disable-line no-process-env
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
