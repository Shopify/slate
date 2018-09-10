test(`passes 'webpack.cssnano.settings' config to cssnano`, () => {
  global.slateUserConfig = {
    'webpack.cssnano.settings': {some: 'value'},
  };

  jest.mock('cssnano');

  const cssnano = require('cssnano');

  require('../sass.prod');

  expect(cssnano).toBeCalledWith(
    global.slateUserConfig['webpack.cssnano.settings'],
  );
});
