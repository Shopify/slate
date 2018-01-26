import path from 'path';

module.exports = {
  cssVarLoaderEnable: true,
  cssVarLoaderLiquidPath: [
    path.resolve(__dirname, '../__tests__/fixtures/css-variables.liquid'),
  ],
};
