var path = require('path');
var findRoot = require('find-root');
var utils = require('../includes/utils.js');
var msg = require('../includes/messages.js');

var slateRoot = path.resolve(__dirname, '../..');
var destRoot = process.cwd();

module.exports = function(args/*, options*/) {
  if (args.length === 0) {
    process.stdout.write(msg.noGenerator());

  } else {
    var scriptArgs;

    switch (args[0]) {
    case 'theme':
      scriptArgs = ['generate-theme', destRoot];
      if (args[1]) {
        scriptArgs.push(args[1]);
      }
      utils.runScript(slateRoot, scriptArgs);
      break;

    case 'section':
      var themeRoot = findRoot(destRoot);
      scriptArgs = ['generate-section', themeRoot];
      if (args[1]) {
        scriptArgs.push(args[1]);
      }
      utils.runScript(slateRoot, scriptArgs);
      break;

    default:
      process.stdout.write(msg.unknownGenerator());
    }
  }
};
