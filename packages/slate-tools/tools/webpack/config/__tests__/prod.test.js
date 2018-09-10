test(`merges contents of 'webpack.config.extend.prod' into webpack config`, () => {
  global.slateUserConfig = {
    'webpack.config.extend.prod': {some: 'value'},
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

  require('../prod');

  expect(merge).toBeCalledWith(
    expect.arrayContaining([
      global.slateUserConfig['webpack.config.extend.prod'],
    ]),
  );
});
