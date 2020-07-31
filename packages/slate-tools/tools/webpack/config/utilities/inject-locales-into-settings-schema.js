const fs = require('fs-extra');
const path = require('path');
const {
  createSchemaContentWithLocales,
  combineLocales,
} = require('@process-creative/slate-translations');

module.exports = async function(content, filePath) {
  if (path.basename(filePath) !== 'settings_schema.json') {
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
