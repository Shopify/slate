var msg = require('../includes/messages.js');
var themekit = require('../includes/themekit.js');

module.exports = {
  command: function(args) {
    if (args.length === 0) {
      process.stdout.write(msg.noFiles());
    } else {
      themekit.test()
        .then(function() {
          return themekit.commands(['upload'].concat(args));
        });
    }
  }
};
