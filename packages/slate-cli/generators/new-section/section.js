var generators = require('yeoman-generator');
var questions = require('./includes/questions.js');

module.exports = generators.Base.extend({

  constructor: function() {
    generators.Base.apply(this, arguments);

    this.argument('path', {type: String, required: true});
    this.argument('dirname', {type: String, required: false});
  },

  prompting: function() {
    return this.prompt(questions.section(this))
      .then(function(answers) {
        if (answers.dirname) {
          this.dirname = answers.dirname;
        }
      }.bind(this));
  },

  configuring: function() {
    this.destinationRoot(this.path + '/src/sections/' + this.dirname);
  },

  writing: function() {
    var readFiles = [
      this.templatePath('javascript.js'),
      this.templatePath('schema.json'),
      this.templatePath('style.liquid'),
      this.templatePath('template.liquid')
    ];
    var writeFiles = [
      this.destinationPath('javascript.js'),
      this.destinationPath('schema.json'),
      this.destinationPath('style.liquid'),
      this.destinationPath('template.liquid')
    ];

    for (var i = 0; i < readFiles.length; i++) {
      this.fs.copyTpl(readFiles[i], writeFiles[i], {});
    }
  }
});
