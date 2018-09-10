const mock = require('mock-fs');

beforeEach(() => {
  global.slateUserConfig = {};
  jest.resetModules();
});

afterEach(mock.restore);

describe('returns an empty object', () => {
  test(`if 'webpack.babel.enable' config is set to false`, () => {
    global.slateUserConfig['webpack.babel.enable'] = false;

    const babelLoader = require('../babel');
    const results = babelLoader();

    expect(typeof results).toBe('object');
    expect(Object.keys(results).length).toBe(0);
  });
  test(`if file at 'webpack.babel.configPath' config does not exist`, () => {
    const babelLoader = require('../babel');

    mock();

    const results = babelLoader();

    expect(typeof results).toBe('object');
    expect(Object.keys(results).length).toBe(0);
  });
});

describe('returns a webpack config object containing babel-loader', () => {
  test(`if 'webpack.babel.enable' config is true and file at 'webpack.babel.configPath' exists`, () => {
    const babelConfigPath = 'some/path';

    global.slateUserConfig['webpack.babel.configPath'] = babelConfigPath;

    const babelLoader = require('../babel');

    mock({[babelConfigPath]: '{}'});

    const results = babelLoader();

    expect(typeof results).toBe('object');
    expect(results.module).toBeDefined();
    expect(results.module.rules).toBeDefined();
    expect(Array.isArray(results.module.rules)).toBeTruthy();
    expect(typeof results.module.rules[0]).toBe('object');
    expect(results.module.rules[0].options.extends).toBe(babelConfigPath);
  });
});
