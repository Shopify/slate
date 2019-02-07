const fs = require('fs');
const path = require('path');
const {ConcatSource, RawSource} = require('webpack-sources');

module.exports = class localesPlugin {
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    compiler.hooks.emit.tap('Slate Locales Plugin', this.addLocales);
  }
  addLocales(compilation) {
    console.log(path.resolve(compilation.options.context, 'sections'));
    fs.readdir(
      path.resolve(compilation.options.context, 'sections'),
      {withFileTypes: true},
      (err, dirents) => {
        if (err) throw err;
        dirents
          .filter(
            (dirent) =>
              dirent.isDirectory() && dirent.name === 'article-template',
          )
          .map((dirent) => {
            const sectionPath = path.resolve(
              compilation.options.context,
              'sections',
              dirent.name,
            );
            fs.readdir(
              path.resolve(sectionPath),
              {withFileTypes: true},
              (err, dirents) => {
                if (err) throw err;
                if (
                  dirents.find(
                    (obj) => obj.name === 'locales' && obj.isDirectory(),
                  ) &&
                  dirents.find(
                    (obj) => obj.name === 'template.liquid' && obj.isFile(),
                  ) &&
                  dirents.find(
                    (obj) => obj.name === 'schema.json' && obj.isFile(),
                  )
                ) {
                  console.log(
                    JSON.stringify(
                      createMainSchema(
                        combineLocales(path.resolve(sectionPath, 'locales')),
                        path.resolve(sectionPath, 'schema.json'),
                      ),
                    ),
                  );

                  compilation.assets['template.liquid'] = new ConcatSource(
                    new RawSource(
                      fs.readFileSync(
                        path.resolve(sectionPath, 'template.liquid'),
                      ),
                    ),
                    new RawSource(
                      `{% schema %}${JSON.stringify(
                        createMainSchema(
                          combineLocales(path.resolve(sectionPath, 'locales')),
                          path.resolve(sectionPath, 'schema.json'),
                        ),
                      )} {% endschema %} `,
                    ),
                  );
                  // console.log(
                  //   JSON.stringify(
                  //     combineLocales(path.resolve(sectionPath, 'locales')),
                  //   ),
                  // );
                }
              },
            );
          });
      },
    );
  }
};

function getLocalizedValue(key, language, localizedSchema) {
  function getNestedValue(json, keys) {
    if (keys.length === 1) {
      return json[keys[0]];
    } else {
      return getNestedValue(json[keys.splice(0, 1)], keys);
    }
  }

  return getNestedValue(localizedSchema[language], key.split('.'));
}

function getLocalizedValues(key, mainSchema, localizedSchema) {
  // eslint-disable-next-line
  let combinedTranslationsObject = {};
  for (const i in localizedSchema) {
    combinedTranslationsObject[i] = getLocalizedValue(key, i, localizedSchema);
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
        // obj[i] = 'dog';
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
