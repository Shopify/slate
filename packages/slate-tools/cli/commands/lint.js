const fs = require('fs');
const argv = require('yargs').argv;

const {runEslint} = require('../../tools/eslint');
const {runStylelint} = require('../../tools/stylelint');
const {runThemelint} = require('../../tools/theme-lint');
const config = require('../../slate-tools.config');

const {scripts, styles, locales} = argv;
const runAll =
  typeof scripts === 'undefined' &&
  typeof styles === 'undefined' &&
  typeof locales === 'undefined';
const linters = [];

if (scripts || runAll) {
  runEslint();
}

if (styles || runAll) {
  runStylelint();
}

if (locales || runAll) {
  runThemelint();
}
