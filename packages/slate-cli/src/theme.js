import {existsSync, mkdirSync} from 'fs'; // eslint-disable-line node/no-deprecated-api
import {green, red} from 'chalk';
import {join, normalize} from 'path';
import debug from 'debug';
import findRoot from 'find-root';
import {downloadFromUrl, unzip, startProcess, writePackageJsonSync} from './utils';

const logger = debug('slate-cli:theme');
const depKeys = ['dependencies', 'devDependencies'];
const s3Url = 'https://sdks.shopifycdn.com/slate/latest/slate-src.zip';

/**
 * A slate theme.
 * @constructor
 */
export default class Theme {
  constructor(cwd) {
    logger('Instantiated Theme');

    this.cwd = cwd;
    this.root = null;
    this.pkg = {};
    this.tools = {
      name: '@shopify/slate-tools',
      binName: 'slate-tools',
      bin: null,
      version: null,
    };

    this.setRoot(this.cwd);
    this.setPkg();
    this.setTools();
  }

  /**
   * Checks for specified dependency in theme's package.json.
   *
   * @param {string} dependency - The name of the dependency.
   *
   * @return {boolean} - Whether dependency exists or not
   */
  hasDependency(dependency) {
    let hasDependencies = false;

    for (const key of depKeys) {
      if ((key in this.pkg && dependency in this.pkg[key])) {
        hasDependencies = true;
        break;
      }
    }

    if (hasDependencies) {
      logger(`${green('✓')} package.json has required dependency: ${this.tools.name}`);
      return true;
    }

    logger(`${red('✗')} package.json missing dependency ${this.tools.name}. Try \`npm install ${this.tools.name}\`.`);
    return false;
  }

  /**
   * Creates new theme from slate-theme in S3.
   *
   * @param {string} name - The name of the theme.
   */
  create(name = 'theme') {
    this.dirName = name;
    this.root = join(this.cwd, this.dirName);

    if (existsSync(this.root)) {
      return Promise.reject(red(`  ${this.root} is not an empty directory`));
    }

    console.log('  This may take some time...');
    console.log('');

    mkdirSync(this.root);

    return downloadFromUrl(s3Url, join(this.root, 'slate-theme.zip'))
      .then((themeZipFile) => {
        logger(`Download complete ${themeZipFile}`);

        return unzip(themeZipFile, this.root);
      })
      .then(() => {
        console.log(`  ${green('✓')} slate-theme download completed`);

        const pkg = join(this.root, 'package.json');

        writePackageJsonSync(pkg, this.dirName);

        return startProcess('npm', ['install', '@shopify/slate-tools', '-D'], {
          cwd: this.root,
        });
      })
      .then(() => {
        console.log(`  ${green('✓')} devDependencies installed`);
        console.log(`  ${green('✓')} ${this.dirName} theme is ready`);
        console.log('');

        return;
      });
  }

  /**
   * Sets root to closest package.json path.
   *
   * @param {string} cwd - The path to bubble up from.
   */
  setRoot(cwd) {
    try {
      this.root = normalize(findRoot(cwd));
      logger(`Found theme root: ${this.root}`);
    } catch (err) {
      logger(err);
    }
  }

  /**
   * Sets pkg to require theme's package.json based on root.
   *
   */
  setPkg() {
    try {
      const pkgPath = join(this.root, 'package.json');
      this.pkg = require(pkgPath);
      logger(`Found theme package.json: ${pkgPath}`);
    } catch (err) {
      logger(err);
    }
  }

  /**
   * Sets tools to slate-tools binary based on root.
   *
   */
  setTools() {
    try {
      this.tools.bin = join(this.root, normalize(`/node_modules/.bin/${this.tools.binName}`));
      this.tools.version = this.pkg.devDependencies[this.tools.name] || this.pkg.dependencies[this.tools.name];
      logger(`Found bin: ${this.tools.bin} - version ${this.tools.version}`);
    } catch (err) {
      logger(err);
    }
  }
}
