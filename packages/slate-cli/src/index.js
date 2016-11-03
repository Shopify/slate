#!/usr/bin/env node

import {join, normalize} from 'path';
import debug from 'debug';
import minimist from 'minimist';
import Theme from './theme';
import {startProcess} from './utils';

const logger = debug('slate-cli:cli');

/**
 * A slate cli.
 * @constructor
 */
class Cli {
  constructor(cwd) {
    logger('Instantiated Cli');

    this.binName = 'slate';
    this.argv = minimist(process.argv.slice(2));
    this.pkg = require(join(__dirname, normalize('../package.json')));
    this.theme = new Theme(cwd);

    if (this.checkForVersionArgument()) {
      this.outputVersion();

      return;
    }

    if (this.checkForNewTheme()) {
      this.theme.create(this.argv._[2])
        .catch((err) => {
          console.error(err);
        });

      return;
    }

    if (this.checkForThemeDependencies()) {
      this.spawnThemeCommand(cwd);

      return;
    }

    console.error('Please provide valid command.');
  }

  /**
   * Checks for version argument in argv.
   *
   */
  checkForVersionArgument() {
    if (this.argv._.length === 0 && (this.argv.v || this.argv.version)) { // eslint-disable-line id-length
      logger('Found version argument');
      return true;
    }

    logger('No version argument');
    return false;
  }

  /**
   * Checks for new theme command in argv.
   *
   */
  checkForNewTheme() {
    if (this.argv._.length > 0 && this.argv._[0] === 'new' && this.argv._[1] === 'theme') {
      logger('Found new theme command');
      return true;
    }

    logger('No new theme command');
    return false;
  }

  /**
   * Checks for theme dependencies.
   *
   */
  checkForThemeDependencies() {
    if (this.theme.hasDependency(this.theme.tools.name)) {
      logger(`Theme has required dependency: ${this.theme.tools.name}`);
      return true;
    }

    console.error(`Theme is missing dependency ${this.theme.tools.name}. Try \`npm install ${this.theme.tools.name}\`.`);
    return false;
  }

  /**
   * Ouputs version info about slate-cli and slate-tools
   *
   */
  outputVersion() {
    console.log(`  ${this.binName}       ${this.pkg.version}`);

    if (this.theme.hasDependency(this.theme.tools.name) && this.theme.tools.version) {
      console.log(`  ${this.theme.tools.binName} ${this.theme.tools.version}`);
      return;
    }

    console.log(`  ${this.theme.tools.binName} n/a - not inside a Slate theme directory`);
  }

  /**
   * Starts theme command on local slate-tools
   *
   */
  spawnThemeCommand() {
    logger(`Spawning theme command to: ${this.theme.tools.bin}`);
    startProcess(this.theme.tools.bin, process.argv.slice(2));
  }
}

const workingDirectory = process.cwd();
const slate = new Cli(workingDirectory);

export default slate;
