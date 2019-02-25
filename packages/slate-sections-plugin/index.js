const fs = require('fs-extra');
const path = require('path');
const {ConcatSource, RawSource} = require('webpack-sources');
const _ = require('lodash');

module.exports = class sectionsPlugin {
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    compiler.hooks.compilation.tap(
      'Slate Sections Plugin',
      this.addLocales.bind(this),
    );
  }

  async addLocales(compilation) {
    const files = await fs.readdir(this.options.from);
    files.forEach(async (file) => {
      const fileStat = await fs.stat(path.resolve(this.options.from, file));
      if (fileStat.isDirectory()) {
        this._handleSectionDirectory(
          path.resolve(this.options.from, file),
          compilation,
        );
      } else if (fileStat.isFile() && path.extname(file) === '.liquid') {
        this._addLiquidFileToAssets(
          path.resolve(this.options.from, file),
          compilation,
        );
      }
    });
  }

  /**
   * If the liquid file (template.liquid) exists in a subdirectory of the sections folder, the output
   * liquid file takes on the directoryName.liquid, otherwise the output file has the same name of the
   * liquid file in the sections directory
   *
   * @param {string} relativePathFromSections The relative path from the source sections directory
   * @returns The output file name of the liquid file.
   */
  _getOutputFileName(relativePathFromSections) {
    if (relativePathFromSections.includes(this.options.genericTemplateName)) {
      const sectionName = relativePathFromSections.split(path.sep)[0];
      return `${sectionName}.liquid`;
    } else {
      return relativePathFromSections;
    }
  }

  /**
   * In order to output to the correct location in the dist folder based on their slate.config we must
   * get a relative path from the webpack output path that is set
   *
   * @param {string} liquidSourcePath // Absolute path to the source liquid file
   * @param {Compilation} compilation // Webpack Compilation object
   * @returns The key thats needed to provide the Compilation object the correct location to output
   * Sources
   */
  _getOutputKey(liquidSourcePath, compilation) {
    const relativePathFromSections = path.relative(
      this.options.from,
      liquidSourcePath,
    );

    const fileName = this._getOutputFileName(relativePathFromSections);

    // The relative path from the output set in webpack, to the specified output for sections in slate config
    const relativeOutputPath = path.relative(
      compilation.compiler.outputPath,
      this.options.to,
    );

    return path.join(relativeOutputPath, fileName);
  }

  /**
   * Adds the file to the webpack compilation assets so it can be emitted to the dist folder
   *
   * @param {*} sourcePath Path to liquid file
   * @param {*} compilation Webpack Compilation object
   * @param {*} [schemaSource=null] If there is a schema object to be appended it would be passed here as a RawSource
   */
  async _addLiquidFileToAssets(sourcePath, compilation, schemaSource = null) {
    const liquidContent = await fs.readFile(sourcePath, 'utf-8');
    const liquidSource = new RawSource(liquidContent);
    const outputKey = this._getOutputKey(sourcePath, compilation);

    if (schemaSource) {
      compilation.assets[outputKey] = new ConcatSource(
        liquidSource,
        schemaSource,
      );
    } else {
      compilation.assets[outputKey] = liquidSource;
    }
  }

  /**
   * Determines if external schema exists, and whether a locales folder exists that that needs to be
   * added to the schema prior to adding the liquid file to assets
   *
   * @param {*} directoryPath Absolute directory path to the section source folder
   * @param {*} compilation Webpack Compilation Object
   */
  async _handleSectionDirectory(directoryPath, compilation) {
    const files = await fs.readdir(directoryPath);

    const liquidSourcePath = path.resolve(
      directoryPath,
      this.options.genericTemplateName,
    );
    if (files.includes('schema.json')) {
      const combinedLocales = files.includes('locales')
        ? await this._combineLocales(path.resolve(directoryPath, 'locales'))
        : null;

      const schemaContent = combinedLocales
        ? await this._createSchemaContentWithLocales(
            combinedLocales,
            path.resolve(directoryPath, 'schema.json'),
          )
        : await fs.readFile(path.resolve(directoryPath, 'schema.json'));
      const schemaSource = new RawSource(
        `{% schema %}\n${schemaContent}{% endschema %}`,
      );
      this._addLiquidFileToAssets(liquidSourcePath, compilation, schemaSource);
    } else {
      this._addLiquidFileToAssets(liquidSourcePath, compilation);
    }
  }

  /**
   * Gets all the translations for a translation key
   *
   * @param {*} key The key of the value to receive within the locales json object
   * @param {*} localizedSchema Object containing all the translations in locales
   * @returns Object with index for every language in the locales folder
   */
  _getLocalizedValues(key, localizedSchema) {
    const combinedTranslationsObject = {};
    Object.keys(localizedSchema).forEach((language) => {
      combinedTranslationsObject[language] = _.get(
        localizedSchema[language],
        key,
      );
    });
    return combinedTranslationsObject;
  }

  /**
   * Goes through the main schema to get the translation keys and to fill the schema with translations
   *
   * @param {*} localizedSchema The schema with the combined locales
   * @param {*} mainSchemaPath The path to the main schema (schema.json)
   * @returns
   */
  async _createSchemaContentWithLocales(localizedSchema, mainSchemaPath) {
    const traverse = (obj) => {
      for (const i in obj) {
        if (typeof obj[i].t === 'string') {
          obj[i] = this._getLocalizedValues(obj[i].t, obj, localizedSchema);
        } else if (typeof obj[i] === 'object') {
          traverse(obj[i]);
        }
      }
      return JSON.stringify(obj);
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

    const accumulator = {};
    await Promise.all(
      jsonFiles.map(async (file) => {
        const localeCode = path
          .basename(file)
          .split('.')
          .shift();
        const fileContents = JSON.parse(
          await fs.readFile(path.resolve(localesPath, file), 'utf-8'),
        );
        accumulator[localeCode] = fileContents;
      }),
    );

    return accumulator;
  }
};
