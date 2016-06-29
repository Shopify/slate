var msg = require('../includes/messages.js');
var themekit = require('../includes/themekit.js');

module.exports = function() {
  setupThemeKit()
    .then(function() {
      process.stdout.write(msg.installerSuccess('slate-cli'));
    });
};

function setupThemeKit() {
  return themekit
    .install()
    .then(function() {
      process.stdout.write(msg.installerPath('ThemeKit', themekit.path()));
    })
    .catch(function(error) {
      process.sterr.write(msg.installerFailed('ThemeKit', error));
    });
}
