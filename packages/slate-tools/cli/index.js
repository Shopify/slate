#!/usr/bin/env node
const spawn = require('cross-spawn');
const chalk = require('chalk');
const argv = require('minimist')(process.argv.slice(2));
const slateEnv = require('@shopify/slate-env');

const script = process.argv[2];
const args = process.argv.slice(3);

try {
  slateEnv.assign(argv.env);
} catch (error) {
  console.log(chalk.red(error));
  process.exit(1);
}

let result;

function init() {
  switch (script) {
    case 'build':
    case 'deploy':
    case 'start':
    case 'zip':
    case 'lint':
    case 'format':
      result = spawn.sync(
        'node',
        [require.resolve(`./commands/${script}`)].concat(args),
        {stdio: 'inherit'},
      );
      process.exit(result.status);
      break;
    case 'test':
      result = spawn.sync('../node_modules/jest/bin/jest.js', [].concat(args), {
        stdio: 'inherit',
      });
      process.exit(result.status);
      break;
    default:
      console.log(`Unknown script "${script}".`);
      console.log('Perhaps you need to update slate-tools?');
      break;
  }
}

init();
