const argv = require('yargs').argv;

const {runEslintFix} = require('../../tools/eslint');
const {runStylelintFix} = require('../../tools/stylelint');
const {runPrettierJson} = require('../../tools/prettier');

const {scripts, styles, json} = argv;
const runAll =
  typeof scripts === 'undefined' &&
  typeof styles === 'undefined' &&
  typeof json === 'undefined';

if (scripts || runAll) {
  runEslintFix();
}

if (styles || runAll) {
  runStylelintFix();
}

if (json || runAll) {
  runPrettierJson();
}
