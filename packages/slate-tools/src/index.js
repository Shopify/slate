#!/usr/bin/env node

const program = require('commander');

program._name = 'slate';

require('./commands/build')(program);
require('./commands/deploy')(program);
require('./commands/start')(program);
require('./commands/watch')(program);
require('./commands/zip')(program);

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
