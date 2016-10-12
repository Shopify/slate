var msg = require('../includes/messages.js');
var command = require('@shopify/themekit').command;

module.exports = {
  command: function(args, options) {
    if (args.length === 0) {
      return process.stdout.write(msg.noFiles());
    } else {
      if (options.environment) {
        return new Promise(function(resolve, reject) {
          command({
            args: ['upload', '-env', options.environment].concat(args)
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
            args: ['upload'].concat(args)
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
  }
};
