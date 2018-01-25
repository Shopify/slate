#!/usr/bin/env node
const spawn = require('cross-spawn');

const script = process.argv[2];
const args = process.argv.slice(3);

let result;

switch (script) {
  case 'build':
  case 'deploy':
  case 'start':
  case 'zip':
    result = spawn.sync(
      'node',
      [require.resolve(`./scripts/${script}`)].concat(args),
      {stdio: 'inherit'},
    );
    process.exit(result.status);
    break;
  case 'test':
    result = spawn.sync('./node_modules/jest/bin/jest.js', [].concat(args), {
      stdio: 'inherit',
    });
    process.exit(result.status);
    break;
  default:
    console.log(`Unknown script "${script}".`);
    console.log('Perhaps you need to update slate-tools?');
    break;
}
