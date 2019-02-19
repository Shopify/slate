const fs = require('fs-extra');
const path = require('path');
const {ConcatSource, RawSource} = require('webpack-sources');
const _ = require('lodash');

module.exports = class localesPlugin {
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    compiler.hooks.compilation.tap('Slate Locales Plugin', this.addLocales);
  }

  async addLocales(compilation) {
    const dirents = await fs.readdir(
      path.resolve(compilation.options.context, 'sections'),
      {withFileTypes: true},
    );
    // eslint-disable-next-line prefer-arrow-callback
    dirents.forEach((dirent) => {
      if (dirent.isDirectory()) {
        traverseDirectory(
          dirent,
          path.resolve(compilation.options.context, 'sections'),
          compilation,
          dirents,
        );
      } else if (dirent.isFile() && path.extname(dirent.name) === '.liquid') {
        getSchema(
          dirent,
          path.resolve(compilation.options.context, 'sections'),
          compilation,
          dirents,
        );
      }
    });
  }
};

async function getSchema(liquidDirent, directoryPath, compilation, dirents) {
  if (liquidDirent.name === 'template.liquid') {
    const outputKey = `../sections${
      directoryPath.split('/sections')[1]
    }.liquid`;

    if (
      dirents.find((obj) => obj.name === 'locales' && obj.isDirectory()) &&
      dirents.find((obj) => obj.name === 'schema.json' && obj.isFile())
    ) {
      compilation.assets[outputKey] = new ConcatSource(
        new RawSource(
          fs.readFileSync(path.resolve(directoryPath, 'template.liquid')),
        ),
        new RawSource(
          `{% schema %}\n ${JSON.stringify(
            createMainSchema(
              combineLocales(path.resolve(directoryPath, 'locales')),
              path.resolve(directoryPath, 'schema.json'),
            ),
            null,
            2,
          )}{% endschema %}`,
        ),
      );
    } else if (
      dirents.find((obj) => obj.name === 'schema.json' && obj.isFile())
    ) {
      compilation.assets[outputKey] = new ConcatSource(
        new RawSource(
          fs.readFileSync(path.resolve(directoryPath, 'template.liquid')),
        ),
        new RawSource(
          `{% schema %}\n${fs.readFileSync(
            path.resolve(directoryPath, 'schema.json'),
          )}{% endschema %}`,
        ),
      );
    } else {
      compilation.assets[outputKey] = new RawSource(
        fs.readFileSync(path.resolve(directoryPath, 'template.liquid')),
      );
    }
  } else {
    const liquidContent = await fs.readFile(
      path.resolve(directoryPath, liquidDirent.name),
      'utf8',
    );
    const outputKey = `../sections${
      directoryPath.split('/sections')[1] === ''
        ? `/${liquidDirent.name}`
        : `${directoryPath.split('/sections')[1]}/${liquidDirent.name}`
    }`;
    if (
      liquidContent.match(/{%\s*schema\s*%}([\s\S]+){%\s*endschema\s*%}/gim) ||
      !dirents.find(
        (obj) => obj.name === liquidDirent.name.replace('.liquid', '.json'),
      )
    ) {
      compilation.assets[outputKey] = new RawSource(liquidContent);
    } else {
      compilation.assets[outputKey] = new ConcatSource(
        new RawSource(liquidContent),
        new RawSource(
          `{% schema %}\n${fs.readFileSync(
            path.resolve(
              directoryPath,
              liquidDirent.name.replace('.liquid', '.json'),
            ),
          )}{% endschema %}`,
        ),
      );
    }
  }
}

async function traverseDirectory(dirent, directoryPath, compilation) {
  const dirents = await fs.readdir(path.resolve(directoryPath, dirent.name), {
    withFileTypes: true,
  });
  dirents.forEach((subdirent) => {
    if (subdirent.isDirectory() && subdirent.name !== 'locales') {
      traverseDirectory(
        subdirent,
        path.resolve(directoryPath, dirent.name),
        compilation,
      );
    } else if (
      subdirent.isFile() &&
      path.extname(subdirent.name) === '.liquid'
    ) {
      getSchema(
        subdirent,
        path.resolve(directoryPath, dirent.name),
        compilation,
        dirents,
      );
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

function createMainSchema(localizedSchema, mainSchemaPath) {
  function traverse(obj) {
    for (const i in obj) {
      if (typeof obj[i].t === 'string') {
        obj[i] = getLocalizedValues(obj[i].t, obj, localizedSchema);
      } else if (typeof obj[i] === 'object') {
        traverse(obj[i]);
      }
    }
  }
  // eslint-disable-next-line
  let mainSchema = JSON.parse(fs.readFileSync(mainSchemaPath, 'utf-8'));
  traverse(mainSchema);
  return mainSchema;
}

function combineLocales(localesPath) {
  return fs
    .readdirSync(localesPath)
    .filter((fileName) => fileName.endsWith('.json'))
    .reduce((accumulator, file) => {
      const localeCode = path
        .basename(file)
        .split('.')
        .shift();
      const fileContents = JSON.parse(
        fs.readFileSync(path.resolve(localesPath, file), 'utf-8'),
      );
      accumulator[localeCode] = fileContents;
      return accumulator;
    }, {});
}
