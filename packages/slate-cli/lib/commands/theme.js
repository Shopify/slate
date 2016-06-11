var path = require('path');
var findRoot = require('find-root');
var utils = require('../includes/utils.js');
var msg = require('../includes/messages.js');

/**
 * `slate theme <task>`
 * Suite of locally run commands - programmatically call `npm.run` to execute
 * scripts from the current directory's root `package.json` file
 * (assuming you're within a slate dir)
 *
 * @param args {Array} - command passed to cli with `slate theme` (start|test|build|deploy|watch|zip)
 * @param options {Object} - command line options (deploy [--manual]|watch [--nosync])
 * @function
 */
module.exports = function(args, options) {
  if (args.length === 0) {
    process.stdout.write(msg.noGenerator());

  } else {
    var destRoot = findRoot(process.cwd());
    var scriptArgs;
    switch (args[0]) {

    case 'start': // rebuilds theme, deploys to current environment, watches for file changes
      utils.runScript(destRoot, ['start']);
      break;

    case 'test': // runs any linters/test-runners defined in the project (eslint, mocha, etc.)
      utils.runScript(destRoot, ['test']);
      break;

    case 'build': // (re)builds `dist/` folder from `src/` contents
      utils.runScript(destRoot, ['build']);
      break;

    case 'deploy': // full deploy to current environment (opt. `--manual` flag to deploy zip via admin)
      scriptArgs = options.manual
        ? ['deploy-manual']
        : ['deploy'];
      utils.runScript(destRoot, scriptArgs);
      break;

    case 'watch': // watch `src/` & `dist/` directories for changes...
      scriptArgs = options.nosync
        ? ['watch-nosync']
        : ['watch'];
      utils.runScript(destRoot, scriptArgs);
      break;

    case 'zip': // (re)build `src/` & compress to `uploads/<package>.zip`
      utils.runScript(destRoot, ['zip']);
      break;

    default: // runs `start` by default
      utils.runScript(destRoot, ['start']);
    }
  }
};
