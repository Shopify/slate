const path = require('path');
const fs = require('fs');

const themeDirectory = fs.realpathSync(process.cwd());

function getSlateConfig() {
  try {
    const slateRcPath = resolveTheme('slate.config.js');
    return require(slateRcPath);
  } catch (error) {
    return {};
  }
}

function generate(schema, slaterc = getSlateConfig()) {
  // Creates a config object of default or slaterc values
  const config = _generateConfig([schema], slaterc)[schema.id];
  config.__schema = schema;

  return config;
}

function _generateConfig(items, overrides) {
  const config = {};

  items.forEach((item) => {
    if (Array.isArray(item.items)) {
      config[item.id] = _generateConfig(
        item.items,
        overrides && overrides[item.id],
      );
    } else if (overrides && typeof overrides[item.id] !== 'undefined') {
      config[item.id] = overrides[item.id];
    } else if (typeof item.default !== 'undefined') {
      config[item.id] = item.default;
    }
  });

  return config;
}

function resolveTheme(relativePath) {
  return path.resolve(themeDirectory, relativePath);
}

function resolveSelf(relativePath) {
  return path.resolve(__dirname, relativePath);
}

module.exports = {
  generate,
  resolveTheme,
  resolveSelf,
  getSlateConfig,
};
