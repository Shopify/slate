const path = require('path');
const SlateConfig = require('@yourwishes/slate-config');
const { getEntryPoints } = require('./get-entrypoints');
const config = new SlateConfig(require('../../../../slate-tools.schema'));

module.exports = () => {
  return getEntryPoints({
    liquidDir: config.get('paths.theme.src.templates'),
    scriptsDir: path.join(config.get('paths.theme.src.scripts'), 'templates'),
    entryType: 'template'
  });
};
