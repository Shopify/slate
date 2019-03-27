const fs = require('fs-extra');
const path = require('path');
const {RawSource} = require('webpack-sources');

const PLUGIN_NAME = 'Slate Snippets Plugin';

module.exports = class SnippetFolders {
  constructor(options = {}) {
    this.options = this._validateOptions(options);
  }

  apply(compiler) {
    compiler.hooks.emit.tapPromise(PLUGIN_NAME, this.addSnippets.bind(this));
  }

  async addSnippets(compilation) {
    const files = await fs.readdir(this.options.from);
    const compilationOutput = compilation.compiler.outputPath;

    // Add snippets folder to webpack context
    compilation.contextDependencies.add(this.options.from);

    return Promise.all(
      files.map(async (file) => {
        const fileLocation = path.resolve(this.options.from, file);
        const fileStat = await fs.stat(fileLocation);

        if (fileStat.isDirectory()) {
          const folder = file;
          const folderFiles = await fs.readdir(fileLocation);

          await Promise.all(
            folderFiles.map(async (folderFile) => {
              const pathToLiquidFile = path.resolve(
                this.options.from,
                folder,
                folderFile,
              );
              const outputKey = this._getOutputKey(
                pathToLiquidFile,
                compilationOutput,
              );
              compilation.assets[outputKey] = await this._getLiquidSource(
                pathToLiquidFile,
              );
            }),
          );
        } else if (fileStat.isFile() && path.extname(file) === '.liquid') {
          const outputKey = this._getOutputKey(
            path.resolve(this.options.from, file),
            compilationOutput,
          );
          compilation.assets[outputKey] = await this._getLiquidSource(
            path.resolve(this.options.from, file),
          );
        }
      }),
    );
  }

  _validateOptions(options) {
    if (!options.hasOwnProperty('from') || typeof options.from !== 'string') {
      throw TypeError('Missing or Invalid From Option');
    }
    if (!options.hasOwnProperty('to') || typeof options.to !== 'string') {
      throw TypeError('Missing or Invalid To Option');
    }

    return options;
  }

  /**
   * If the liquid file exists in a subdirectory of the snippets folder, the output liquid file
   * takes on the directory-name.liquid, otherwise the output file has the same name of the liquid
   * file in the snippets directory
   *
   * @param {string} relativePathFromSnippets The relative path from the source snippets directory
   * @returns {string} The output file name of the liquid file.
   */
  _getOutputFileName(relativePathFromSnippets) {
    if (relativePathFromSnippets.includes('/')) {
      return relativePathFromSnippets.replace('/', '-');
    }

    return relativePathFromSnippets;
  }

  /**
   * In order to output to the correct location in the dist folder based on their slate.config we
   * must get a relative path from the webpack output path that is set
   *
   * @param {string} liquidSourcePath // Absolute path to the source liquid file
   * @param {Compilation} compilationOutput // Output path set for webpack
   * @returns The key thats needed to provide the Compilation object the correct location to output
   * Sources
   */
  _getOutputKey(liquidSourcePath, compilationOutput) {
    const relativePathFromSnippets = path.relative(
      this.options.from,
      liquidSourcePath,
    );

    const fileName = this._getOutputFileName(relativePathFromSnippets);

    // The relative path from the output set in webpack, to the specified output for sections in
    // slate config
    const relativeOutputPath = path.relative(
      compilationOutput,
      this.options.to,
    );

    return path.join(relativeOutputPath, fileName);
  }

  /**
   * Reads file and creates a source object
   *
   * @param {*} sourcePath Absolute path to liquid file
   * @returns RawSource object with the contents of the file
   */
  async _getLiquidSource(sourcePath) {
    const liquidContent = await fs.readFile(sourcePath, 'utf-8');

    return new RawSource(liquidContent);
  }
};
