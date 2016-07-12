module.exports = {
  theme: function(generator) {
    var questions = [{
      type: 'confirm',
      name: 'multiEnv',
      message: 'Will you be deploying this theme to multiple environments?'
    }, {
      type: 'checkbox',
      name: 'environments',
      message: 'Which environments would you like to use?',
      choices: [{
        name: 'production',
        checked: true
      }, {
        name: 'staging',
        checked: true
      }, {
        name: 'development',
        checked: true
      }, {
        name: 'custom'
      }],
      when: hasMultipleEnvironments,
      validate: requireEnv
    }, {
      type: 'input',
      name: 'customEnv',
      message: 'Enter the custom environment names you would like to create (comma separated)',
      when: hasCustomEnvironments
    }, {
      type: 'list',
      name: 'defaultEnv',
      message: 'Which environment would you like to use as default?',
      choices: getDefaultEnvSelect,
      when: hasMultipleEnvironments,
      validate: requireEnv
    }, {
      type: 'input',
      name: 'repo',
      message: 'Which repo would you like to start with?',
      default: 'git@github.com:Shopify/slate.git'
    }, {
      type: 'confirm',
      name: 'initGit',
      message: 'Will you be tracking this theme in git?'
    }, {
      type: 'input',
      name: 'repositoryUrl',
      message: 'Enter the URL of your git repository',
      when: hasGitRepo,
      validate: function(answer) {
        return answer.length < 1
          ? 'You must provide a URL for your git repository.'
          : true;
      }
    }];

    if (!generator.dirname) {
      questions.unshift({
        type: 'input',
        name: 'dirname',
        message: 'Please enter a name for your theme (folder will be created)',
        validate: function(answer) {
          return answer
            ? true
            : 'You must provide a name for your theme.';
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

/**
 *
 * @param answers {Object}
 * @returns {Boolean}
 * @private
 */
function hasGitRepo(answers) {
  return answers.initGit;
}

/**
 *
 * @param answers {Object}
 * @returns {Boolean}
 * @private
 */
function getDefaultEnvSelect(answers) {
  return answers.environments;
}

/**
 *
 * @param answers {Object}
 * @returns {Boolean}
 * @private
 */
function requireEnv(answer) {
  return answer.length < 1
    ? 'You must create at least one environment.'
    : true;
}
