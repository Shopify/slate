var msg = require('../includes/messages.js');
var utils = require('../includes/utils.js');

module.exports = {
  command: function() {
    process.stdout.write(msg.versionInfo());
  },
  help: function() {
    utils.logHelpMsg([
      'Usage: slate version',
      '',
      'Output the current version of Slate CLI installed on your system.'
    ]);
  }
};
