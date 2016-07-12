var generators = require('yeoman-generator');
var _ = require('lodash');
var open = require('open');
var questions = require('./includes/questions');
var fetchRepo = require('./includes/cloneRepo.js');

var mainGenerator = generators.Base.extend({

  constructor: function() {
    generators.Base.apply(this, arguments);

    this.argument('path', {
      type: String,
      required: true
    });
    this.argument('dirname', {
      type: String,
      required: false
    });
    this.environments = [];
  },

  prompting: function() {
    return this.prompt(questions.theme(this))
      .then(function(answers) {
        var env = answers.environments;
        if (answers.customEnv) {
          env.pop(); // removes `custom` selection
          env = env.concat(answers.customEnv.split(/,\s*/));
        }

        this.environments = env;
        this.defaultEnv = answers.defaultEnv;

        if (answers.dirname) {
          this.dirname = answers.dirname;
        }

        this.repo = answers.repo;
        this.initGit = answers.initGit;
        this.repositoryUrl = answers.repositoryUrl;
      }.bind(this));
  },

  configuring: function() {
    this.destinationRoot(this.path + '/' + this.dirname);
    this.config.set('environments', this.environments);
    this.config.set('name', this.dirname);
    this.config.save();
  },

  writing: function() {
    return this._cloneRepo(this.repo, this.destinationPath())
      .then(function() {
        if (this.initGit) {
          return this._initRepo(this.destinationRoot(), 0)
            .then(function(repo) {
              return this._addRemote(repo, 'origin', this.repositoryUrl);
            }.bind(this));
        } else {
          return true;
        }
      }.bind(this));
  },

  install: function() {
    if (this.fs.exists(this.destinationPath('package.json'))) {
      this.npmInstall();
    }

    if (this.fs.exists(this.destinationPath('bower.json'))) {
      this.bowerInstall();
    }
  },

  end: function() {
    open(this.destinationPath('config.yml'));
  }
});

_.extend(mainGenerator.prototype, fetchRepo);

module.exports = mainGenerator;
