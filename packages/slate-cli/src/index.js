#!/usr/bin/env node

import {join} from 'path';
import {spawn} from 'child_process';
import debug from 'debug';
import minimist from 'minimist';
import findRoot from 'find-root';
import Theme from './theme';
import Tools from './tools';

const logger = debug('slate-cli:cli');
const workingDirectory = process.cwd();
const currentDirectory = __dirname;

class Cli {
  constructor(cwd) {
    this.binName = 'slate';
    this.argv = minimist(process.argv.slice(2));
    this.pkg = require(join(currentDirectory, '..', 'package.json'));
    this.closestPkg = findRoot(cwd);
    this.theme = new Theme(this.closestPkg);
    this.tools = new Tools(this.closestPkg);

    this.checkForVersionArgument();
    this.checkForNewTheme();
    this.checkForThemeCommands();
  }

  checkForVersionArgument() {
    if (this.argv._.length === 0 && (this.argv.v || this.argv.version)) { // eslint-disable-line id-length
      console.log(`  ${this.binName}       ${this.pkg.version}`);

      if (this.theme.hasDependency(this.tools.name) === true && this.tools.pkg.version) {
        console.log(`  ${this.tools.binName} ${this.tools.pkg.version}`);
      } else {
        console.log(`  ${this.tools.binName} n/a - not inside a Slate theme directory`);
      }

      process.exit(); // eslint-disable-line no-process-exit
    }

    return;
  }

  checkForNewTheme() {
    if (this.argv._.length > 0 && this.argv._[0] === 'new' && this.argv._[1] === 'theme') {
      console.log('  This may take some time...');
      console.log('');
      this.theme.create();

      process.exit(); // eslint-disable-line no-process-exit
    }

    return;
  }

  checkForThemeCommands() {
    if (this.theme.hasDependency(this.tools.name) === true) {
      logger('Passing on to slate-tools...');

      this.startProcess(this.tools.bin, process.argv.slice(2));
    } else {
      console.error(`package.json missing dependency ${this.tools.name}. Try \`npm install ${this.tools.name}\`.`);
    }
  }

  startProcess(command, args, options) {
    const defaultedOptions = options || {};
    defaultedOptions.stdio = defaultedOptions.stdio || 'inherit';

    return new Promise((resolve, reject) => {
      const child = spawn(command, args, defaultedOptions);

      child.on('error', (err) => {
        reject(err);
      });

      child.on('close', (code) => {
        resolve(code);
      });
    });
  }
}

const slate = new Cli(workingDirectory);

export default slate;
