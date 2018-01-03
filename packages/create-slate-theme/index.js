#!/usr/bin/env node

const fs = require('fs-extra');
const chalk = require('chalk');

const config = require('./config');
const createSlateTheme = require('./createSlateTheme');

const args = process.argv.slice(2);
const root = args[0];
const starter = args[1] || config.defaultStarter;

const currentNodeVersion = process.versions.node;
const semver = currentNodeVersion.split('.');
const major = semver[0];

if (major < 4) {
  const nodeError =
    // eslint-disable-next-line prefer-template
    'You are running Node ' +
    currentNodeVersion +
    '.\n`' +
    'Create Slate Theme requires Node 4 or higher. \n' +
    'Please update your version of Node.';

  throw new Error(chalk.red(nodeError));
}

if (typeof root === 'undefined') {
  throw new Error(chalk.red('A project name is required.'));
}

if (fs.existsSync(root)) {
  throw new Error(chalk.red(`The ${root} directory already exists`));
}

createSlateTheme(root, starter);
