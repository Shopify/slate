#!/usr/bin/env node
const spawn = require('cross-spawn');
const analytics = require('@shopify/slate-analytics');
const {getSlateConfig} = require('@shopify/slate-config');
const packageJson = require('../package.json');

const script = process.argv[2];
const args = process.argv.slice(3);

let result;

async function init() {
  await analytics.init();

  analytics.event('slate-tools:cli:start', {
    slateConfig: getSlateConfig(),
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
