const argv = require('minimist')(process.argv.slice(2));
const chalk = require('chalk');
const uuidGenerator = require('uuid/v4');
const {event} = require('@shopify/slate-analytics');
const shopify = require('../lib/shopify-deploy');
const setEnvironment = require('../lib/set-slate-env');

const id = uuidGenerator();

event('slate-tools:deploy:start', {id});
setEnvironment(argv.env);
shopify
  .overwrite()
  .then(() => {
    event('slate-tools:deploy:end', {id});
    return console.log(chalk.green('\nFiles overwritten successfully!\n'));
  })
  .catch(error => {
    event('slate-tools:deploy:error', {id, error});
    console.log(`\n${chalk.red(error)}\n`);
  });
