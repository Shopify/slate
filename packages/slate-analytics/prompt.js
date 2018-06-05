const inquirer = require('inquirer');
const clearConsole = require('react-dev-utils/clearConsole');
const wrap = require('word-wrap');
const chalk = require('chalk');
const {validateEmail} = require('./utils');

const question = {
  type: 'input',
  name: 'email',
  message: 'To continue, please enter your email address:',
  validate: (input) => {
    return validateEmail(input) || 'Email not valid. Please try again.';
  },
};

function forNewConsent() {
  clearConsole();
  console.log(
    wrap(
      '👋  Welcome to Slate! During the alpha, we would like to gather usage analytics, such as interactions with Slate commands, performance reports, and error occurances. The data does not include any sensitive information. The detailed list of data we gather can be found at:',
      {width: 80, indent: ''},
    ),
  );
  console.log(
    chalk.cyan('\n  https://github.com/Shopify/slate/wiki/Slate-Analytics'),
  );
  console.log();

  question.message = 'To continue, please enter your email address:';

  return inquirer.prompt(question);
}

function forUpdatedConsent(email) {
  console.log(
    "It looks like you've recently upgraded Slate and this new version has some changes to tracking and we need to get your updated consent decision before proceed. During the alpha, we would like to gather usage analytics, such as interactions with Slate commands, performance reports, and error occurances. The data does not include any sensitive information. The list of updates can be found at:",
  );
  console.log(
    chalk.cyan(
      '\n  https://github.com/Shopify/slate/tree/1.x/packages/slate-analytics',
    ),
  );
  console.log();

  question.message = 'To continue, please confirm your email address:';
  question.default = email;

  return inquirer.prompt(question);
}

module.exports = {forNewConsent, forUpdatedConsent};
