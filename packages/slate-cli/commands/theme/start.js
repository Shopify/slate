var findRoot = require('find-root');
var utils = require('../../includes/utils.js');

module.exports = {
  command: function(args, options) {
    var themeRoot = findRoot(process.cwd());
    
    if (options.environment) {
      process.env.tkEnvironments = options.environment.split(/\s*,\s*|\s+/)[0]; // eslint-disable-line no-process-env
    }
    
    var scriptArgs = options.nosync
      ? ['start-nosync']
      : ['start'];
    
    utils.runScript(themeRoot, scriptArgs);
  },
  help: function() {
    utils.logHelpMsg([
      'Usage: slate start [--options]',
      '',
      'Deploy theme, launch Browsersync in a new browser tab at http://localhost:3000 and watch for file changes.',
      '',
      'Options:',
      '',
      '  -e, --environment  deploy to a specific environment',
      '  -n, --nosync       watch for changes without using Browsersync'
    ]);
  }
};
