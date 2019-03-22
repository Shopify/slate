const fs = require('fs-extra');
const path = require('path');
const {
  createSchemaContentWithLocales,
  combineLocales,
} = require('@shopify/slate-translations');

module.exports = async function(content, filePath) {
  if (!filePath.includes('settings_schema.json')) {
    return content;
  }

  const localesFolder = path.resolve(path.dirname(filePath), 'locales');
  const combinedLocales = (await fs.exists(localesFolder))
    ? await combineLocales(localesFolder)
    : null;

  return combinedLocales
    ? createSchemaContentWithLocales(combinedLocales, filePath)
    : content;
};
