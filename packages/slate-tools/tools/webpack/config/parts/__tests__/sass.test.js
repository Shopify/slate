beforeEach(jest.resetModules);

test(`passes 'webpack.cssnano.settings' config to cssnano`, () => {
  const oldNodeEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';

  jest.mock('cssnano');

  const cssnano = require('cssnano');
  const SlateConfig = require('@shopify/slate-config');
  const config = new SlateConfig(require('../../../../../slate-tools.schema'));

  require('../sass');

  expect(cssnano).toBeCalledWith(config.get('webpack.cssnano.settings'));

  process.env.NODE_ENV = oldNodeEnv;
});

test(`passes 'webpack.postcss.plugins' config to PostCSS Loader`, () => {
  const SlateConfig = require('@shopify/slate-config');
  const config = new SlateConfig(require('../../../../../slate-tools.schema'));

  const part = require('../sass');
  const postcssLoader = part.module.rules[0].use.find(
    (item) => item.loader === 'postcss-loader',
  );

  expect(postcssLoader.options.plugins).toMatchObject(
    config.get('webpack.postcss.plugins'),
  );
});

test(`passes 'webpack.sourceMap.styles' config to loaders`, () => {
  const SlateConfig = require('@shopify/slate-config');
  const config = new SlateConfig(require('../../../../../slate-tools.schema'));

  const part = require('../sass');
  const postcssLoader = part.module.rules[0].use.find(
    (item) => item.loader === 'postcss-loader',
  );
  const cssLoader = part.module.rules[0].use.find(
    (item) => item.loader === 'css-loader',
  );
  const sassLoader = part.module.rules[0].use.find(
    (item) => item.loader === 'sass-loader',
  );

  expect(postcssLoader.options.sourceMap).toBe(
    config.get('webpack.sourceMap.styles'),
  );
  expect(cssLoader.options.sourceMap).toBe(
    config.get('webpack.sourceMap.styles'),
  );
  expect(sassLoader.options.sourceMap).toBe(
    config.get('webpack.sourceMap.styles'),
  );
});
