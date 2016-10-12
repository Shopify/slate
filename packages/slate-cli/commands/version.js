var msg = require('../includes/messages.js');
var utils = require('../includes/utils.js');
var command = require('@shopify/themekit').command;

module.exports = {
  command: function() {
    return new Promise(function(resolve, reject) {
      command({
        args: ['version']
      }, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    })
    .then(function() {
      process.stdout.write(msg.versionInfo());
    });
  },
  help: function() {
    utils.logHelpMsg([
      'Usage: slate version',
      '',
      'Output the current version of Slate CLI installed on your system.'
    ]);
  }
};
