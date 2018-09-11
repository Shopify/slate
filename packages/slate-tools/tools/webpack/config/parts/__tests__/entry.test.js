jest.mock('../../utilities/get-layout-entrypoints', () => {
  return jest.fn(() => {
    return {
      someEntryPoint: 'somePath',
    };
  });
});

jest.mock('../../utilities/get-template-entrypoints', () => {
  return jest.fn();
});

test(`copys and overrides values in webpacks entry config with 'webpack.entrypoints' config`, () => {
  global.slateUserConfig = {
    'webpack.entrypoints': {someEntryPoint: 'someNewPath'},
  };

  const {entry} = require('../entry');

  expect(entry).toMatchObject(global.slateUserConfig['webpack.entrypoints']);
});
