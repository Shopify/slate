module.exports = {
  theme: function(generator) {
    var questions = [{
      type: 'confirm',
      name: 'multiEnv',
      message:
        'Environment Setup\n' +
        '-----------------\n' +
        'Slate can manage deploys to your development and production stores.  ' +
        'Will you be deploying this theme to more than one store/environment?'
    }, {
      type: 'checkbox',
      name: 'environments',
      message:
        'Please provide an alias for each store/environment you would like to deploy to:',

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
      message: 'Custom store/environment aliases (comma separated):',
      when: hasCustomEnvironments
    }, {
      type: 'list',
      name: 'defaultEnv',
      message: 'Which store/environment would you like to deploy to by default?',
      choices: getDefaultEnvSelect,
      when: hasMultipleEnvironments,
      validate: requireEnv
    }, {
      type: 'confirm',
      name: 'initGit',
      message: 'Would you like to track this theme in git?'
    }, {
      type: 'input',
      name: 'repositoryUrl',
      message: 'Please enter the URL the git repository for this theme:',
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
  var hasCustom = hasCustomEnvironments(answers);

  if (hasCustom) {
    answers.environments.pop(); // removes `custom` selection
    answers.environments = answers.environments.concat(answers.customEnv.split(/,\s*/));
  }

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
    ? 'You must provide at least one store/environment alias.'
    : true;
}
