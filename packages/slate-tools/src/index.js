#!/usr/bin/env node

const debug = require('debug')('slate-tools');
const program = require('commander');

require('./commands/build')(program, debug);
require('./commands/deploy')(program, debug);
require('./commands/start')(program, debug);
require('./commands/test')(program, debug);
require('./commands/watch')(program, debug);
require('./commands/zip')(program, debug);

require('./commands/new')(program, debug);

program.on('--help', () => {
  console.log('  Troubleshooting:');
  console.log('');
  console.log('    If you encounter any issues, here are some preliminary steps to take:');
  console.log('      - `git pull` latest version of Slate CLI.');
  console.log('      - `npm install` to make sure you have all the dependencies.');
  console.log('      - `npm link` to make sure that the symlink exists and Slate CLI is globally installed.');
  console.log('');
});

program.on('*', () => {
  console.log('');
  console.log(`  Unknown command ${program.args.join(' ')}.`);
  console.log('');
  program.help();
});

program.parse(process.argv);
