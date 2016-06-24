module.exports = {
  section: function(generator) {
    var questions = [];

    if (!generator.dirname) {
      questions.unshift({
        type: 'input',
        name: 'dirname',
        message: 'Please enter a name for your section (folder will be created)',
        validate: function(answer) {
          return answer
            ? true
            : 'You must provide a name for your section.';
        }
      });
    }
    return questions;
  }
};
