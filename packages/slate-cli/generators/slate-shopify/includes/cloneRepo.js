var NodeGit = require('nodegit');
var Promise = require('bluebird');
var path = require('path');
var rimraf = Promise.promisify(require('rimraf'));
var _ = require('lodash');

module.exports = {

  /**
   * Uses NodeGit to clone git repository and writes it to the destination path
   *
   * @param repo {String} - the location (url) of git repository
   * @param destination {String} - the local destination path to write repository
   */
  _cloneRepo: function(repo, destination) {
    var cache = path.join(this.cacheRoot(), repo);
    var options = {};

    _.set(options, 'fetchOpts.callbacks.certificateCheck', checkCertificate);
    _.set(options, 'fetchOpts.callbacks.credentials', getCredentials);

    return rimraf(cache)
      .then(function() {
        return NodeGit.Clone(repo, cache, options);
      })
      .then(function() {
        var glob = [
          cache + '/**',
          '!' + cache + '/.git/**',
          '!' + cache + '/jsdoc-conf.json',
          '!' + cache + '/docs/**',
          '!' + cache + '/package.json',
          '!' + cache + '/tasks/includes/config.js',
          '!' + cache + '/generators/**'
        ];

        this.fs.copy(glob, destination, {
          globOptions: {
            dot: true
          }
        });

        this.fs.copyTpl(
          path.join(cache, '/generators/config.yml.ejs'),
          path.join(destination, '/config.yml'), {
            environments: this.environments
          }
        );

        this.fs.copyTpl(
          path.join(cache, '/generators/package.json.ejs'),
          path.join(destination, '/package.json'), {
            name: this.dirname,
            hasGitRepo: this.initGit,
            repositoryUrl: this.repositoryUrl
          }
        );

        this.fs.copyTpl(
          path.join(cache, '/generators/tasks/includes/config.js.ejs'),
          path.join(destination, '/tasks/includes/config.js'), {
            env: this.defaultEnv
          }
        );
      }.bind(this));
  },

  /**
   * Uses NodeGit to initalize git repository
   *
   * @param repo {String} - the local path to the repository
   * @param isBare {Boolean} - whether to use provided path as the working directory
   */
  _initRepo: function(repo, isBare) {
    return NodeGit.Repository.init(repo, isBare);
  },

  /**
   * Uses NodeGit to add remote to git repository
   *
   * @param repo {String} - the local path to the repository
   * @param name {String} - the name of the git remote
   * @param url {String} - the url of the git remote
   */
  _addRemote: function(repo, name, url) {
    return NodeGit.Remote.create(repo, name, url)
      .catch(function(err) {
        this.log(err);
      }.bind(this));
  }
};

/**
 * OS X libgit2 is unable to look up GitHub certificates correctly.
 * In order to bypass this problem, we're going to passthrough
 * the certificate check.
 *
 * @returns {Boolean}
 * @private
 */
function checkCertificate() {
  return 1;
}

/**
 * In order to authorize the clone operation, we'll need to respond
 * to a low-level callback that expects credentials to be passed.
 * This function will respond back with the credentials from the
 * agent. You'll notice we handle the second argument passed to
 * credentials, userName.
 *
 * @param url {String}
 * @param userName {String}
 * @returns {String} - The newly created credential object.
 * @private
 */
function getCredentials(url, userName) {
  return NodeGit.Cred.sshKeyFromAgent(userName);
}
