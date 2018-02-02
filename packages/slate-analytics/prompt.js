const inquirer = require('inquirer');
const questions = require('./questions');

function forNewConsent() {
  console.log(
    'Welcome to Slate! In order to improve Slate, we would like to gather usage statistics, such as interactions with Slate commands, performance reports, and error occurances. The data does not include any sensitive information. The detailed list of data we gather can be found at:',
  );
  console.log('\n  https://slate.shopify.com/analytics');
  console.log();

  return inquirer.prompt(questions);
}

function forUpdatedConsent() {
  console.log(
    'Thanks for upgrading Slate! This new version has some changes to tracking and we need to get your updated consent decision before proceed. The list of updates can be found at:',
  );
  console.log('\n  https://slate.shopify.com/analytics');
  console.log();

  return inquirer.prompt(questions.slice(0, 1));
}

module.exports = {forNewConsent, forUpdatedConsent};
