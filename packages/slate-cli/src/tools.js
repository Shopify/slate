import debug from 'debug';

const logger = debug('slate-cli:tools');

export default class Tools {
  constructor(themeRootDirectory) {
    this.root = themeRootDirectory;
    this.name = '@shopify/slate-tools';
    this.binName = 'slate-tools';
    this.bin = `${this.root}/node_modules/.bin/${this.binName}`;
    this.pkg = {};

    this.setPkg();
  }

  setPkg() {
    try {
      this.pkg = require(`${this.root}/node_modules/${this.name}/package.json`);
    } catch (err) {
      logger(err);
      this.pkg = {};
    }
  }
}
