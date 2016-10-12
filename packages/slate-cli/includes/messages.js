var pkg = require('../package.json');

module.exports = {
  versionInfo: function() {
    return 'slate-cli v' + pkg.version + ' - Shopify Theme Development Toolkit  \n';
  },

  noFiles: function() {
    return 'No files provided\n';
  },

  unknownCommand: function() {
    return 'Unknown command, please refer to help. \n';
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
  }
};
