var generators = require('yeoman-generator');
var _ = require('lodash');
var questions = [
  {
    type: 'input',
    name: 'name',
    message: 'Enter a name for your new theme'
  }
];

module.exports = generators.Base.extend({

  constructor: function() {
    generators.Base.apply(this, arguments);

    this.argument('appname', {type: String, required: true});
    questions.default = _.camelCase(this.appname);
  },

  initializing: function() {
    this.log('Im initializing now');
  },

  prompting: function() {
    return this.prompt(questions)
      .then(function(answers) {
        this.log('hi, ' + answers.name); // do stuff with returned answers
      }.bind(this));
  },

  configuring: function() {
    this.log('Im configuring now');
    // setup theme configuration files (json & yaml)
  },

  writing: function() {
    this.log('Im writing now');
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
