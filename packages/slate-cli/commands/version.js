var msg = require('../includes/messages.js');

module.exports = function() {
  process.stdout.write(msg.versionInfo());
};
