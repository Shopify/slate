const fs = require('fs-extra');
const path = require('path');
const {ConcatSource, RawSource} = require('webpack-sources');
const _ = require('lodash');

// If section liquid file is the GENERIC_TEMPLATE_NAME the output liquid will take the form of directoryName.liquid
const GENERIC_TEMPLATE_NAME = 'template.liquid';

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
    // eslint-disable-next-line prefer-arrow-callback
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

  _getOutputFileName(relativePathFromSections) {
    if (relativePathFromSections.includes(GENERIC_TEMPLATE_NAME)) {
      return relativePathFromSections.replace(
        `/${GENERIC_TEMPLATE_NAME}`,
        '.liquid',
      );
    } else {
      return relativePathFromSections;
    }
  }

  _getOutputKey(liquidSourcePath, compilation) {
    const relativePathFromSections = liquidSourcePath.replace(
      `${this.options.from}/`,
      '',
    );

    const fileName = this._getOutputFileName(relativePathFromSections);

    // The relative path form the output set in webpack, to the specified output for sections in slate config
    const relativeOutputPath = path.relative(
      compilation.compiler.outputPath,
      this.options.to,
    );

    return `${relativeOutputPath}/${fileName}`;
  }

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

  async _handleSectionDirectory(directoryPath, compilation) {
    const files = await fs.readdir(directoryPath);

    const liquidSourcePath = path.resolve(directoryPath, GENERIC_TEMPLATE_NAME);
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

  _getLocalizedValues(key, mainSchema, localizedSchema) {
    // eslint-disable-next-line
    let combinedTranslationsObject = {};
    // eslint-disable-next-line
    for (const i in localizedSchema) {
      combinedTranslationsObject[i] = _.get(localizedSchema[i], key);
    }

    return combinedTranslationsObject;
  }

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
    // eslint-disable-next-line
    let mainSchema = JSON.parse(await fs.readFile(mainSchemaPath, 'utf-8'));
    return traverse(mainSchema);
  }

  async _combineLocales(localesPath) {
    const localesFiles = await fs.readdir(localesPath);
    const jsonFiles = localesFiles.filter((fileName) =>
      fileName.endsWith('.json'),
    );

    // eslint-disable-next-line prefer-const
    let accumulator = {};
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
