var generators = require('yeoman-generator');
var config = require('./config.js');

module.exports = generators.Base.extend({
  constructor: function() {
    generators.Base.apply(this, arguments);

    this.argument('name', {type: String, required: true});
    this.argument('path', {type: String, required: true});

    this.destinationRoot(this.path);
  },

  initializing: function() {
    this.log('Im initializing now');
  },

  prompting: function() {
    return this.prompt(config.questions(this))

      .then(function(answers) {
        this.log('hi, ' + answers.name); // do stuff with returned answers
        this.answers = answers;
      }.bind(this));
  },

  configuring: function() {
    this.config.set({
      name: this.answers.name,
      storeurl: this.answers.storeurl,
      token: this.answers.token,
      apikey: this.answers.apikey
    });

    this.config.save();
  },

  writing: function() {
    var readFile = this.templatePath('config.yml');
    var writeFile = this.destinationPath('config.yml');

    this.fs.copyTpl(readFile, writeFile, {
      apikey: this.config.get('apikey'),
      token: this.config.get('token'),
      storeurl: this.config.get('storeurl')
    });

    // write `src` folder content for the theme
  },

  install: function() {
    this.log('Im installing now');
    // npm install, any other installs to run?
  },

  end: function() {
    this.log('Im finished now');
  }
});
