var pkg = require('../../package.json');

module.exports = {
  versionInfo: function() {
    return 'slate-cli: version ' + pkg.version + ' - Shopify Theme Development Framework  \n';
  },

  noFiles: function() {
    return 'No files provided\n';
  },

  noGenerator: function() {
    return 'No generator specified, please use one of the following commands:\n ' + this.generatorsList();
  },

  unknownGenerator: function() {
    return 'Unknown generator, please use one of the following commands:\n' + this.generatorsList();
  },

  generatorsList: function() {
    return ' slate new theme\n slate new section\n';
  },

  unknownInstaller: function() {
    return 'Unknown installer, please use one of the following commands:\n' + this.installersList();
  },

  installersList: function() {
    return ' slate setup themekit\n';
  },

  installerPath: function(name, path) {
    return name + ': ' + path + '\n';
  },

  installerFailed: function(name, error) {
    return name + ' failed to install\n ' + error + '\n';
  },

  installerSuccess: function(name) {
    return name + ' successfully installed\n';
  }
};
