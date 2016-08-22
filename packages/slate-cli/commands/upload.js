var msg = require('../includes/messages.js');
var themekit = require('../includes/themekit.js');

module.exports = {
  command: function(args, options) {
    if (args.length === 0) {
      return process.stdout.write(msg.noFiles());
    } else {
      if (options.environment) {
        return themekit.commands(['upload', '-env', options.environment].concat(args));
      } else {
        return themekit.commands(['upload'].concat(args));
      }
    }
  }
};
