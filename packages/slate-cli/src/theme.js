import {green, red} from 'chalk';
import {join} from 'path';
import debug from 'debug';

const logger = debug('slate-cli:theme');
const depKeys = ['dependencies', 'devDependencies'];

export default class Theme {
  constructor(themeRootDirectory) {
    this.root = themeRootDirectory;
    this.pkg = {};

    this.setPkg();
    debug(`Loading theme: ${this.pkg}`);
  }

  setPkg() {
    try {
      this.pkg = require(join(this.root, 'package.json'));
    } catch (err) {
      logger(err);
      this.pkg = {};
    }
  }

  hasDependency(dependency) {
    let hasDependencies = false;

    for (const key of depKeys) {
      if ((key in this.pkg && dependency in this.pkg[key])) {
        hasDependencies = true;
        break;
      }
    }

    if (hasDependencies) {
      logger(`${green('✓')} package.json has required dependency: @shopify/slate-tools`);
      return true;
    } else {
      logger(`${red('✗')} package.json missing dependency @shopify/slate-tools. Try \`npm install @shopify/slate-tools\`.`);
      return false;
    }
  }

  create() {
    return new Promise((resolve) => {
      console.log('  I wish I could make a new theme...');
      resolve();
    });
  }
}
