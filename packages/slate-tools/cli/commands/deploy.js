const argv = require('minimist')(process.argv.slice(2));
const chalk = require('chalk');
const {replace, upload} = require('@shopify/slate-sync');
const promptContinueIfPublishedTheme = require('../prompts/continue-if-published-theme');

const deploy = argv.replace ? replace : upload;

promptContinueIfPublishedTheme()
  .then((answer) => {
    if (!answer) {
      process.exit(0);
    }

    return deploy();
  })
  .then(() => {
    return console.log(chalk.green('\nFiles overwritten successfully!\n'));
  })
  .catch((error) => {
    console.log(`\n${chalk.red(error)}\n`);
  });
