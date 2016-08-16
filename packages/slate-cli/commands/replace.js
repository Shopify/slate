var themekit = require('../includes/themekit.js');

module.exports = {
  command: function(args, options) {
    themekit.test()
      .then(function() {
        if (options.environment) {
          return themekit.commands(['replace', '-env', options.environment].concat(args));
        } else {
          return themekit.commands(['replace'].concat(args));
        }
      });
  }
};
