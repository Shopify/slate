var path = require('path');
var slateRoot = path.resolve(__dirname, '../../..');
var msg = require('../../../includes/messages.js');

module.exports = {

  /**
   * Resolves the path to the node module.
   *
   * @param nodeModule {String} - The name of node module
   * @returns {String} - The path to the node module
   */
  _getScaffoldPath: function(nodeModule) {
    var nodeModulePath = path.join(slateRoot, '/node_modules/' + nodeModule);

    if (!this.fs.exists(path.join(nodeModulePath, 'package.json'))) {
      process.stdout.write(msg.unknownScaffold());
    }

    return nodeModulePath;
  },

  /**
   * Uses node_modules to get scaffold and then writes it to the destination path.
   *
   * @param scaffold {String} - npm install name
   * @param destination {String} - the local destination path to write scaffold
   */
  _copyScaffold: function(scaffold, destination) {
    var glob = [
      scaffold + '/**',
      '!' + scaffold + '/.git/**',
      '!' + scaffold + '/node_modules/**',
      '!' + scaffold + '/bower_components/**',
      '!' + scaffold + '/jsdoc-conf.json',
      '!' + scaffold + '/docs/**',
      '!' + scaffold + '/package.json',
      '!' + scaffold + '/.npmignore',
      '!' + scaffold + '/circle.yml',
      '!' + scaffold + '/**/*.ejs'
    ];

    this.fs.copy(glob, destination, {
      globOptions: {
        dot: true
      }
    });

    if (this.fs.exists(scaffold + '/.npmignore')) {
      this.fs.copy(
        path.join(scaffold, '/.npmignore'),
        path.join(destination, '/.gitignore')
      );
    }
    
    this.fs.copy(
      path.join(scaffold, '/circle.yml.ejs'),
      path.join(destination, '/circle.yml')
    );

    this.fs.copyTpl(
      path.join(scaffold, '/config.yml.ejs'),
      path.join(destination, '/config.yml'), {
        environments: this.environments
      }
    );

    this.fs.copyTpl(
      path.join(scaffold, '/package.json.ejs'),
      path.join(destination, '/package.json'), {
        name: this.dirname,
        hasGitRepo: this.initGit,
        repositoryUrl: this.repositoryUrl
      }
    );

    this.fs.copyTpl(
      path.join(scaffold, '/tasks/includes/config.js.ejs'),
      path.join(destination, '/tasks/includes/config.js'), {
        env: this.defaultEnv
      }
    );
  }
};
