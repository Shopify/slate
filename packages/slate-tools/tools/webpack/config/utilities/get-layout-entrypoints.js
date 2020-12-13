const fs = require('fs');
const path = require('path');
const SlateConfig = require('@yourwishes/slate-config');
const { getEntryPoints } = require('./get-entrypoints');
const config = new SlateConfig(require('../../../../slate-tools.schema'));

module.exports = () => {
  return getEntryPoints({
    liquidDir: config.get('paths.theme.src.layout'),
    scriptsDir: path.join(config.get('paths.theme.src.scripts'), 'layout'),
    entryType: 'layout'
  });
};