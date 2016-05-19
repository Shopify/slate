var path = require('path');
var utils = require('../includes/utils.js');
var msg = require('../includes/messages.js');

var slateRoot = path.resolve(__dirname, '../..');
var destRoot = process.cwd();

module.exports = function(args/*, options*/) {
  if (args.length === 0) {
    process.stdout.write(msg.noGenerator());

  } else {
    switch (args[0]) {
    case 'theme':
      var scriptArgs = ['generate-theme', destRoot];
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
