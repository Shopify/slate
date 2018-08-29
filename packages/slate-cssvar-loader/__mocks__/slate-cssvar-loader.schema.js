const path = require('path');
const commonPaths = require('@shopify/slate-config/common/paths.schema');

module.exports = {
  ...commonPaths,

  'cssVarLoader.enable': true,

  'cssVarLoader.liquidPath': [
    path.resolve(__dirname, '../__tests__/fixtures/css-variables.liquid'),
  ],
};
