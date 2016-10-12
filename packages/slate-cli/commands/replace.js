var command = require('@shopify/themekit').command;

module.exports = {
  command: function(args, options) {
    if (options.environment) {
      return new Promise(function(resolve, reject) {
        command({
          args: ['replace', '-env', options.environment].concat(args)
        }, function(err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    } else {
      return new Promise(function(resolve, reject) {
        command({
          args: ['replace'].concat(args)
        }, function(err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }
  }
};
