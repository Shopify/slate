var msg = require('../includes/messages.js');
var themekit = require('../includes/themekit.js');

module.exports = function() {
  // add environment param
  themekit.commands(['replace']);
};
