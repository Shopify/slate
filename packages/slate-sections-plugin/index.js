const fs = require('fs-extra');
const path = require('path');
const { RawSource } = require('webpack-sources');

const PLUGIN_NAME = 'Slate Sections Plugin';

module.exports = class sectionsPlugin {
  constructor(options = {}) {
    this.options = this._validateOptions(options);
  }

  apply(compiler) {
    compiler.hooks.emit.tapPromise(PLUGIN_NAME, this.addLocales.bind(this));
  }

  async addFile({ compilation, compilationOutput, filePath, file }) {
    const source = path.resolve(filePath, file);
    const outputKey = this._getOutputKey(source, compilationOutput);
    compilation.assets[outputKey] = await this._getLiquidSource(source);
  }

  addFiles(params) {
    const { files, filePath } = params;
    return Promise.all(files.map(async file => {
      const absFile = path.resolve(filePath, file);
      const fileStat = await fs.stat(absFile);
      if (fileStat.isDirectory()) {
        let dirFiles = fs.readdirSync(absFile, { withFileTypes: true }).map(f => {
          return f.name;
        });

        return this.addFiles({ ...params, files: dirFiles, filePath: absFile });
      }

      return await this.addFile({ ...params, file });
    }));
  }

  async addLocales(compilation) {
    const files = await fs.readdir(this.options.from);
    const compilationOutput = compilation.compiler.outputPath;

    // Add sections folder to webpack context
    compilation.contextDependencies.add(this.options.from);

    return this.addFiles({
      compilation, compilationOutput, files,
      filePath: path.resolve(this.options.from)
    });
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
   * Returns the filename of the file to be created within the dist directory.
   *
   * @param {string} relativePathFromSections The relative path from the source sections directory
   * @returns The output file name of the liquid file.
   */
  _getOutputFileName(relativePathFromSections) {
    return path.basename(relativePathFromSections);
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
    const relativePathFromSections = path.relative(
      this.options.from,
      liquidSourcePath,
    );

    const fileName = this._getOutputFileName(relativePathFromSections);

    // The relative path from the output set in webpack, to the specified output for sections in slate config
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
