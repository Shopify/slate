#!/usr/bin/env node

var chalk = require('chalk');
var program = require('commander');
var createSlateTheme = require('./createSlateTheme');
var packageJson = require('./package.json');
var config = require('./config');

var currentNodeVersion = process.versions.node;
var semver = currentNodeVersion.split('.');
var major = semver[0];

if (major < 6) {
  console.log(
    chalk.red(
      'You are running Node ' +
        currentNodeVersion +
        '.\n`' +
        'Create Slate Theme requires Node 6 or higher. \n' +
        'Please update your version of Node.'
    )
  );

  process.exit(1);
}

var themeName;
var themeStarter;

program
  .version(packageJson.version)
  .usage(`${chalk.green('<theme-directory>')} [starter-theme] [options]`)
  .arguments('<name> [repo]')
  .option('--skipInstall', 'skip installing theme dependencies')
  .option('--verbose', 'print additional logs')
  .action((name, starter = config.defaultStarter) => {
    themeName = name;
    themeStarter = starter;
  })
  .parse(process.argv);

if (typeof themeName === 'undefined') {
  console.error('Please specify the theme directory:');
  console.log(
    chalk.cyan(program.name()) + ' ' + chalk.green('<theme-directory>')
  );
  console.log();
  console.log('For example:');
  console.log(chalk.cyan(program.name()) + ' ' + chalk.green('my-theme'));
  console.log();
  console.log(
    'Run' + chalk.cyan(program.name() + ' --help') + ' to see all options.'
  );
  process.exit(1);
}

function assignOption(key) {
  return typeof program[key] === 'undefined'
    ? config.defaultOptions[key]
    : program[key];
}

var options = {
  skipInstall: assignOption('skipInstall'),
};

createSlateTheme(themeName, themeStarter, options);
