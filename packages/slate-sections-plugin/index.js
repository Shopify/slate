const fs = require('fs-extra');
const path = require('path');
const {ConcatSource, RawSource} = require('webpack-sources');
const _ = require('lodash');
const SlateConfig = require('@shopify/slate-config');
const config = new SlateConfig(require('../slate-tools/slate-tools.schema'));

const DEFAULT_GENERIC_TEMPLATE_NAME = 'template.liquid';
const PLUGIN_NAME = 'Slate Sections Plugin';

module.exports = class sectionsPlugin {
  constructor(options = {}) {
    this.options = this._validateOptions(options);
    this.options.genericTemplateName =
      this.options.genericTemplateName || DEFAULT_GENERIC_TEMPLATE_NAME;
  }

  apply(compiler) {
    compiler.hooks.emit.tapPromise(
      PLUGIN_NAME,
      this.addLocales.bind(this),
    );

    compiler.hooks.afterEmit.tapPromise(
      PLUGIN_NAME,
      this.addSectionsToContext.bind(this),
    );
  }

  async addLocales(compilation) {
    const files = await fs.readdir(this.options.from);
    const compilationOutput = compilation.compiler.outputPath;
    return Promise.all(
      files.map(async (file) => {
        const fileStat = await fs.stat(path.resolve(this.options.from, file));
        if (fileStat.isDirectory()) {
          const pathToLiquidFile = path.resolve(
            this.options.from,
            file,
            this.options.genericTemplateName,
          );
          const outputKey = this._getOutputKey(
            pathToLiquidFile,
            compilationOutput,
          );
          compilation.assets[
            outputKey
          ] = await this._getWebpackSourceForDirectory(
            path.resolve(this.options.from, file),
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

  addSectionsToContext (compilation) {
    compilation.contextDependencies.add(config.get('paths.theme.src.sections'));

    return Promise.resolve({});
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
   * If the liquid file (template.liquid) exists in a subdirectory of the sections folder, the
   * output liquid file takes on the directoryName.liquid, otherwise the output file has the same
   * name of the liquid file in the sections directory
   *
   * @param {string} relativePathFromSections The relative path from the source sections directory
   * @returns The output file name of the liquid file.
   */
  _getOutputFileName(relativePathFromSections) {
    if (relativePathFromSections.includes(this.options.genericTemplateName)) {
      const sectionName = relativePathFromSections.split(path.sep)[0];
      return `${sectionName}.liquid`;
    }
    return relativePathFromSections;
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

  /**
   * Determines if external schema exists, and whether a locales folder exists that needs to be
   * added to the schema prior to adding the liquid file to assets
   *
   * @param {*} directoryPath Absolute directory path to the section source folder
   * @returns Source object to be added to the compilation's assets
   */
  async _getWebpackSourceForDirectory(directoryPath) {
    const files = await fs.readdir(directoryPath);

    const liquidSourcePath = path.resolve(
      directoryPath,
      this.options.genericTemplateName,
    );

    const liquidSource = await this._getLiquidSource(liquidSourcePath);

    if (files.includes('schema.json')) {
      const combinedLocales = files.includes('locales')
        ? await this._combineLocales(path.resolve(directoryPath, 'locales'))
        : null;

      const schemaContent = combinedLocales
        ? await this._createSchemaContentWithLocales(
            combinedLocales,
            path.resolve(directoryPath, 'schema.json'),
          )
        : JSON.stringify(
            await fs.readJSON(path.resolve(directoryPath, 'schema.json')),
            null,
            2,
          );

      const schemaSource = new RawSource(
        `{% schema %}\n${schemaContent}\n{% endschema %}`,
      );

      return new ConcatSource(liquidSource, schemaSource);
    }

    return liquidSource;
  }

  /**
   * Gets all the translations for a translation key
   *
   * @param {*} key The key of the value to receive within the locales json object
   * @param {*} localizedSchema Object containing all the translations in locales
   * @returns Object with index for every language in the locales folder
   */
  async _getLocalizedValues(key, localizedSchema) {
    const combinedTranslationsObject = {};

    await Promise.all(
      // eslint-disable-next-line array-callback-return
      Object.keys(localizedSchema).map((language) => {
        combinedTranslationsObject[language] = _.get(
          localizedSchema[language],
          key,
        );
      }),
    );

    return combinedTranslationsObject;
  }

  /**
   * Goes through the main schema to get the translation keys and to fill the schema with
   * translations
   *
   * @param {*} localizedSchema The schema with the combined locales
   * @param {*} mainSchemaPath The path to the main schema (schema.json)
   * @returns
   */
  async _createSchemaContentWithLocales(localizedSchema, mainSchemaPath) {
    // eslint-disable-next-line func-style
    const traverse = async (obj) => {
      const objectKeys = Object.keys(obj);
      await Promise.all(
        objectKeys.map(async (key) => {
          if (typeof obj[key].t === 'string') {
            obj[key] = await this._getLocalizedValues(
              obj[key].t,
              localizedSchema,
            );
          } else if (typeof obj[key] === 'object') {
            await traverse(obj[key]);
          }
        }),
      );
      return JSON.stringify(obj, null, 2);
    };
    const mainSchema = await fs.readJSON(mainSchemaPath, 'utf-8');
    return traverse(mainSchema);
  }

  /**
   * Creates a single JSON object from all the languages in locales
   *
   * @param {*} localesPath Absolute path to the locales folder /sections/section-name/locales/
   * @returns
   */
  async _combineLocales(localesPath) {
    const localesFiles = await fs.readdir(localesPath);
    const jsonFiles = localesFiles.filter((fileName) =>
      fileName.endsWith('.json'),
    );

    return jsonFiles.reduce(async (promise, file) => {
      const accumulator = await promise;
      const localeCode = path
        .basename(file)
        .split('.')
        .shift();
      const fileContents = JSON.parse(
        await fs.readFile(path.resolve(localesPath, file), 'utf-8'),
      );
      accumulator[localeCode] = fileContents;
      return accumulator;
    }, Promise.resolve({}));
  }
};
