#!/usr/bin/env node
const spawn = require('cross-spawn');
const chalk = require('chalk');
const argv = require('minimist')(process.argv.slice(2));
const analytics = require('@shopify/slate-analytics');
const SlateConfig = require('@shopify/slate-config');
const slateEnv = require('@shopify/slate-env');
const packageJson = require('../package.json');

const script = process.argv[2];
const args = process.argv.slice(3);
const config = new SlateConfig(require('../slate-tools.schema'));

try {
  slateEnv.assign(argv.env);
} catch (error) {
  console.log(chalk.red(error));
  process.exit(1);
}

let result;

async function init() {
  let slateConfig;

  await analytics.init();

  // Convert user config to JSON string so it can be sent in analytics. Make sure
  // we catch any errors while converting, such as converting a circular object
  // structure to JSON
  try {
    slateConfig = JSON.stringify(config.userConfig);
  } catch (error) {
    slateConfig = JSON.stringify({error: error.message});
  }

  analytics.event('slate-tools:cli:start', {
    slateConfig,
    version: packageJson.version,
  });

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
