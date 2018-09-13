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
  const oldNodeEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'development';

  const SlateConfig = require('@shopify/slate-config');
  const config = new SlateConfig(require('../../../../../slate-tools.schema'));

  const part = require('../sass');
  const postcssLoader = part.module.rules[0].use.find(
    (item) => item.loader === 'postcss-loader',
  );

  expect(postcssLoader.options.plugins).toMatchObject(
    config.get('webpack.postcss.plugins'),
  );

  process.env.NODE_ENV = oldNodeEnv;
});
