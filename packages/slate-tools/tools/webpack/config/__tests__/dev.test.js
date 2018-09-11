test(`merges contents of 'webpack.config.extend.dev' into webpack config`, () => {
  global.slateUserConfig = {
    'webpack.config.extend.dev': {some: 'value'},
  };

  jest.mock('../core', () => {
    return {entry: {}};
  });
  jest.mock('webpack-merge');
  jest.mock('../../entrypoints', () => {
    return {
      templateFiles: jest.fn(),
      layoutFiles: jest.fn(),
    };
  });

  const merge = require('webpack-merge');
  require('../dev');

  expect(merge).toBeCalledWith(
    expect.arrayContaining([
      global.slateUserConfig['webpack.config.extend.dev'],
    ]),
  );
});
