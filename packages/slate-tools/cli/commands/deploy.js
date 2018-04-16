const argv = require('minimist')(process.argv.slice(2));
const chalk = require('chalk');
const {event} = require('@shopify/slate-analytics');
const {replace, upload} = require('@shopify/slate-sync');
const setEnvironment = require('../../tools/webpack/set-slate-env');
const packageJson = require('../../package.json');
const promptContinueIfPublishedTheme = require('../prompts/continue-if-published-theme');

event('slate-tools:deploy:start', {version: packageJson.version});
setEnvironment(argv.env);

const deploy = argv.replace ? replace : upload;

promptContinueIfPublishedTheme()
  .then((answer) => {
    if (!answer) {
      process.exit(0);
    }

    return deploy();
  })
  .then(() => {
    event('slate-tools:deploy:end', {version: packageJson.version});
    return console.log(chalk.green('\nFiles overwritten successfully!\n'));
  })
  .catch((error) => {
    event('slate-tools:deploy:error', {
      version: packageJson.version,
      error,
    });
    console.log(`\n${chalk.red(error)}\n`);
  });
