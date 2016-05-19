module.exports = {
  theme: function(generator) {
    var questions = [
      {
        type: 'confirm',
        name: 'multiEnv',
        message: 'Will you be deploying this theme to multiple environments?'
      },
      {
        type: 'checkbox',
        name: 'environments',
        message: 'Which environments would you like to use?',
        choices: [
          {name: 'production', checked: true},
          {name: 'staging', checked: true},
          {name: 'development', checked: true},
          {name: 'custom'}
        ],
        when: hasMultipleEnvironments,
        validate: function(answer) {
          return answer.length < 1
            ? 'You must create at least one environment.'
            : true;
        }
      },
      {
        type: 'input',
        name: 'customEnv',
        message: 'Enter the environment names you would like to create (comma separated)',
        when: hasCustomEnvironments
      }
    ];

    if (!generator.dirname) {
      questions.unshift({
        type: 'input',
        name: 'dirname',
        message: 'Please enter a name for your theme (folder will be created)',
        validate: function(answer) {
          return answer
            ? 'You must provide a name for your theme.'
            : true;
        }
      });
    }

    return questions;
  }
};


/**
 *
 * @param answers {Object}
 * @returns {Boolean}
 * @private
 */
function hasMultipleEnvironments(answers) {
  if (!answers.multiEnv) {
    answers.environments = ['development'];
  }
  return answers.multiEnv;
}

/**
 *
 * @param answers {Object}
 * @returns {Boolean}
 * @private
 */
function hasCustomEnvironments(answers) {
  var hasCustom = false;
  answers.environments.forEach(function(env) {
    if (env === 'custom') {
      hasCustom = true;
    }
  });
  return hasCustom;
}
