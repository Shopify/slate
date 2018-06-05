const argv = require('yargs').argv;

const {runEslint} = require('../../tools/eslint');
const {runStylelint} = require('../../tools/stylelint');
const {runThemelint} = require('../../tools/theme-lint');

const {scripts, styles, locales} = argv;
const runAll =
  typeof scripts === 'undefined' &&
  typeof styles === 'undefined' &&
  typeof locales === 'undefined';

if (scripts || runAll) {
  runEslint();
}

if (styles || runAll) {
  runStylelint();
}

if (locales || runAll) {
  runThemelint();
}
