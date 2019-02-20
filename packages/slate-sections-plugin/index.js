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
        traverseDirectory(compilation, path.resolve(this.options.from, file));
      } else if (fileStat.isFile() && path.extname(file) === '.liquid') {
        getSchema(file, this.options.from, compilation, files);
      }
    });
  }
};

async function getSchema(
  fileName,
  directoryPath,
  compilation,
  filesInDirectory,
) {
  const liquidFile = await fs.readFile(
    path.resolve(directoryPath, fileName),
    'utf-8',
  );
  let schemaFile = null;

  const outputKey = getOutputKey(fileName, directoryPath, compilation);
  if (
    fileName === GENERIC_TEMPLATE_NAME &&
    filesInDirectory.includes('locales') &&
    filesInDirectory.includes('schema.json')
  ) {
    const combinedLocales = await combineLocales(
      path.resolve(directoryPath, 'locales'),
    );
    schemaFile = JSON.stringify(
      await createMainSchema(
        combinedLocales,
        path.resolve(directoryPath, 'schema.json'),
      ),
    );
  } else if (filesInDirectory.includes(fileName.replace('.liquid', '.json'))) {
    schemaFile = await fs.readFile(
      path.resolve(directoryPath, fileName.replace('.liquid', '.json')),
    );
  }

  if (schemaFile) {
    compilation.assets[outputKey] = new ConcatSource(
      new RawSource(liquidFile),
      new RawSource(`{% schema %}\n ${schemaFile}{% endschema %}`),
    );
  } else {
    compilation.assets[outputKey] = new RawSource(liquidFile);
  }
}

function getOutputKey(fileName, directoryPath, compilation) {
  const outputFileName =
    fileName === GENERIC_TEMPLATE_NAME
      ? `${directoryPath.split('/sections/')[1]}.liquid`
      : fileName;
  const outputPath = compilation.compiler.outputPath;
  const sectionsOutputPath = `${outputPath.split('/dist')[0]}/dist/sections`;
  const relativePathToSections = path.relative(outputPath, sectionsOutputPath);

  return `${relativePathToSections}/${outputFileName}`;
}

async function traverseDirectory(compilation, directoryPath) {
  const files = await fs.readdir(directoryPath);
  files.forEach(async (file) => {
    const fileStat = await fs.stat(path.resolve(directoryPath, file));
    if (fileStat.isDirectory() && file !== 'locales') {
      traverseDirectory(compilation, path.resolve(directoryPath, file));
    } else if (fileStat.isFile() && path.extname(file) === '.liquid') {
      getSchema(file, directoryPath, compilation, files);
    }
  });
}

function getLocalizedValues(key, mainSchema, localizedSchema) {
  // eslint-disable-next-line
  let combinedTranslationsObject = {};
  // eslint-disable-next-line
  for (const i in localizedSchema) {
    combinedTranslationsObject[i] = _.get(localizedSchema[i], key);
  }

  return combinedTranslationsObject;
}

async function createMainSchema(localizedSchema, mainSchemaPath) {
  function traverse(obj) {
    for (const i in obj) {
      if (typeof obj[i].t === 'string') {
        obj[i] = getLocalizedValues(obj[i].t, obj, localizedSchema);
      } else if (typeof obj[i] === 'object') {
        traverse(obj[i]);
      }
    }
    return obj;
  }
  // eslint-disable-next-line
  let mainSchema = JSON.parse(await fs.readFile(mainSchemaPath, 'utf-8'));
  return traverse(mainSchema);
}

async function combineLocales(localesPath) {
  const localesFiles = await fs.readdir(localesPath);
  const jsonFiles = localesFiles.filter((fileName) =>
    fileName.endsWith('.json'),
  );

  // eslint-disable-next-line prefer-const
  let accumulator = {};
  await jsonFiles.map(async (file) => {
    const localeCode = path
      .basename(file)
      .split('.')
      .shift();
    const fileContents = JSON.parse(
      await fs.readFile(path.resolve(localesPath, file), 'utf-8'),
    );
    accumulator[localeCode] = fileContents;
  });
  return accumulator;
}
