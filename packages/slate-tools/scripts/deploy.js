const argv = require('minimist')(process.argv.slice(2));
const chalk = require('chalk');
const shopify = require('../lib/shopify-deploy');
const setEnvironment = require('../lib/set-slate-env');

setEnvironment(argv.env);

shopify
  .overwrite()
  .then(() => {
    return console.log(chalk.green('\nFiles overwritten successfully!\n'));
  })
  .catch(error => {
    console.log(`\n${chalk.red(error)}\n`);
  });
