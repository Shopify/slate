test(`merges contents of 'webpack.config.extend.dev' into webpack config`, () => {
  global.slateUserConfig = {
    'webpack.config.extend.dev': {some: 'value'},
  };

  jest.mock('../parts/core', () => {
    return {entry: {}};
  });
  jest.mock('../parts/entry', () => {
    return {entry: {}};
  });
  jest.mock('../utilities/get-layout-entrypoints');
  jest.mock('../utilities/get-template-entrypoints');
  jest.mock('webpack-merge');

  const merge = require('webpack-merge');

  require('../dev');

  expect(merge).toBeCalledWith(
    expect.arrayContaining([
      global.slateUserConfig['webpack.config.extend.dev'],
    ]),
  );
});
