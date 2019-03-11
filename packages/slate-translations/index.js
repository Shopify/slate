const fs = require('fs-extra');
const path = require('path');
const _ = require('lodash');

/**
 * Goes through the main schema to get the translation keys and to fill the schema with translations
 *
 * @param {*} localizedSchema The schema with the combined locales
 * @param {*} mainSchemaPath The path to the main schema (schema.json)
 * @returns
 */
async function createSchemaContentWithLocales(localizedSchema, mainSchemaPath) {
  // eslint-disable-next-line func-style
  const traverse = async (obj) => {
    const objectKeys = Object.keys(obj);
    await Promise.all(
      objectKeys.map(async (key) => {
        if (typeof obj[key].t === 'string') {
          obj[key] = await _getLocalizedValues(obj[key].t, localizedSchema);
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
async function combineLocales(localesPath) {
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

/**
 * Gets all the translations for a translation key
 *
 * @param {*} key The key of the value to receive within the locales json object
 * @param {*} localizedSchema Object containing all the translations in locales
 * @returns Object with index for every language in the locales folder
 */
async function _getLocalizedValues(key, localizedSchema) {
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

module.exports = {
  createSchemaContentWithLocales,
  combineLocales,
};
