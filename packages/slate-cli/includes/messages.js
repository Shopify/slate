var pkg = require('../package.json');

module.exports = {
  versionInfo: function() {
    return 'slate-cli: version ' + pkg.version + ' - Shopify Theme Development Framework  \n';
  },

  noFiles: function() {
    return 'No files provided\n';
  },

  unknownCommand: function() {
    return 'Unknown command, please refer to help. \n';
  },

  missingDependencies: function() {
    return 'Dependencies missing. Please run slate setup\n';
  },

  noGenerator: function() {
    return 'No generator specified, please use one of the following commands:\n' + this.generatorsList();
  },

  unknownGenerator: function() {
    return 'Unknown generator, please use one of the following commands:\n' + this.generatorsList();
  },

  generatorsList: function() {
    return ' slate new theme\n slate new section\n';
  },

  unknownScaffold: function() {
    return 'Unknown scaffold, please use one of the following scaffolds:\n' + this.scaffoldsList();
  },

  scaffoldsList: function() {
    return ' slate\n';
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
