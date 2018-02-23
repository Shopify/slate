const argv = require('minimist')(process.argv.slice(2));
const chalk = require('chalk');
const { event } = require('@shopify/slate-analytics');
const { overwrite } = require('@shopify/slate-sync');
const setEnvironment = require('../lib/set-slate-env');
const packageJson = require('../package.json');

event('slate-tools:deploy:start', { version: packageJson.version });
setEnvironment(argv.env);

overwrite()
  .then(() => {
    event('slate-tools:deploy:end', { version: packageJson.version });
    return console.log(chalk.green('\nFiles overwritten successfully!\n'));
  })
  .catch(error => {
    event('slate-tools:deploy:error', {
      version: packageJson.version,
      error,
    });
    console.log(`\n${chalk.red(error)}\n`);
  });
