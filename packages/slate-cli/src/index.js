#!/usr/bin/env node

import {readdirSync} from 'fs';
import {join, normalize} from 'path';
import {yellow, red} from 'chalk';
import figures from 'figures';
import findRoot from 'find-root';
import updateNotifier from 'update-notifier';
import program from '@shopify/commander';
import {hasDependency} from './utils';

/**
 * Find closest package.json to be at root of theme.
 *
 * @param {string} directory - A path.
 */
function getThemeRoot(directory) {
  try {
    return normalize(findRoot(directory));
  } catch (err) {
    return null;
  }
}

/**
 * Check package.json for slate-tools.
 *
 * @param {string} themeRoot - The path for the root of the theme.
 */
function checkForSlateTools(themeRoot) {
  const pkgPath = join(themeRoot, 'package.json');
  const pkg = require(pkgPath);

  return hasDependency('@shopify/slate-tools', pkg);
}

/**
 * Output information if/else slate theme directory.
 *
 * @param {boolean} isSlateTheme - Whether in slate theme or not.
 */
function outputSlateThemeCheck(isSlateTheme) {
  if (!isSlateTheme) {
    return;
  }

  console.log('');
  console.log(`  ${yellow(figures.cross)} You are not in a slate theme directory`);
  console.log(`    For full list of commands generate a new theme or switch to an existing slate theme directory`);
  console.log('');
}

const currentDirectory = __dirname;
const workingDirectory = process.cwd();
const pkg = require(join(currentDirectory, normalize('../package.json')));

updateNotifier({
  pkg,
  updateCheckInterval: 1000 * 60 * 60 * 24 * 7, // 1 week
}).notify();

// Global commands
require('./commands/theme').default(program);
require('./commands/version').default(program);

// Dynamically add in theme commands
const themeRoot = getThemeRoot(workingDirectory);
const isSlateTheme = (themeRoot && checkForSlateTools(themeRoot));

if (isSlateTheme) {
  const slateToolsCommands = join(themeRoot, normalize('/node_modules/@shopify/slate-tools/lib/commands'));

  readdirSync(slateToolsCommands)
    .filter((file) => ~file.search(/^[^\.].*\.js$/))
    .forEach((file) => require(join(slateToolsCommands, file)).default(program));
}

if (!process.argv.slice(2).length) {
  outputSlateThemeCheck(isSlateTheme);
  program.help();
}

// Custom help
program.on('--help', () => {
  outputSlateThemeCheck(isSlateTheme);
});

// Unknown command
program.on('*', () => {
  console.log('');
  console.log(`  Unknown command: ${red(program.args.join(' '))}`);
  console.log('');
  outputSlateThemeCheck(isSlateTheme);
  program.help();
});

program.parse(process.argv);
