test(`merges contents of 'webpack.extend' into webpack config`, () => {
  global.slateUserConfig = {
    'webpack.extend': {some: 'value'},
  };

  jest.mock('../parts/core');
  jest.mock('../parts/entry', () => {
    return {};
  });
  jest.mock('../utilities/get-layout-entrypoints');
  jest.mock('../utilities/get-template-entrypoints');
  jest.mock('webpack-merge');

  const merge = require('webpack-merge');

  require('../prod');

  expect(merge).toBeCalledWith(
    expect.arrayContaining([global.slateUserConfig['webpack.extend']]),
  );
});
