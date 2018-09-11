const fs = require('fs');
const path = require('path');
const SlateConfig = require('@shopify/slate-config');
const config = new SlateConfig(require('../../../../slate-tools.schema'));

module.exports = function() {
  const entrypoints = {};

  fs.readdirSync(config.get('paths.theme.src.layouts')).forEach((file) => {
    const name = path.parse(file).name;
    const jsFile = path.join(
      config.get('paths.theme.src.scripts'),
      'layout',
      `${name}.js`,
    );
    if (fs.existsSync(jsFile)) {
      entrypoints[`layout.${name}`] = jsFile;
    }
  });
  return entrypoints;
};
