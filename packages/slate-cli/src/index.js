#!/usr/bin/env node

import {readdirSync} from 'fs';
import {join, normalize} from 'path';
import {green, red} from 'chalk';
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
  if (isSlateTheme) {
    console.log(`  Slate theme: ${green(figures.tick)} inside slate theme directory`);
    console.log('');
  } else {
    console.log(`  Slate theme: ${red(figures.cross)} switch to a slate theme directory for full list of commands`);
    console.log('');
  }
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
  program.outputHelp();
  outputSlateThemeCheck(isSlateTheme);
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
  program.help();
  outputSlateThemeCheck(isSlateTheme);
});

program.parse(process.argv);
