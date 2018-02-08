const path = require('path');
const fs = require('fs');
const validate = require('./validate');

let errors = [];
let warnings = [];

function getSlateConfig() {
  try {
    const slateRcPath = resolveTheme('slate.config.js');
    return require(slateRcPath);
  } catch (error) {
    return {};
  }
}

function generate(schema, slaterc = getSlateConfig()) {
  const items = schema.items || [];
  const config = {};

  // Use the schema to validate .slaterc file
  if (Object.keys(slaterc).length !== 0) {
    const results = validate(schema, slaterc);

    errors = errors.concat(results.errors);
    warnings = warnings.concat(results.warnings);

    if (!results.isValid) {
      throw new Error();
    }
  }

  // Creates a config object of default or slaterc values
  items.forEach(item => {
    if (typeof slaterc[item.id] === 'undefined') {
      config[item.id] = item.default;
    } else {
      config[item.id] = slaterc[item.id];
    }
  });

  return config;
}

function resolveTheme(relativePath) {
  const appDirectory = fs.realpathSync(process.cwd());
  return path.resolve(appDirectory, relativePath);
}

module.exports = {
  generate,
  resolveTheme,
  getSlateConfig,
};
