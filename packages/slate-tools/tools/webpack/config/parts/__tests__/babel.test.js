beforeEach(() => {
  global.slateUserConfig = {};
  jest.resetModules();

  global.slateUserConfig['webpack.babel.configPath'] = '/some/path';

  jest.mock('fs', () => {
    const fs = jest.genMockFromModule('fs');
    fs.originalExistsSync = fs.existsSync;
    fs.existsSync = jest.fn(
      (value) => (value === '/some/path' ? true : fs.originalExistsSync(value)),
    );
    return fs;
  });
});

describe('returns an empty object', () => {
  test(`if 'webpack.babel.enable' config is set to false`, () => {
    global.slateUserConfig['webpack.babel.enable'] = false;

    const part = require('../babel');

    expect(typeof part).toBe('object');
    expect(part.module.rules.length).toBe(0);
  });
  test(`if file at 'webpack.babel.configPath' config does not exist`, () => {
    global.slateUserConfig['webpack.babel.configPath'] = '/some/other/path';

    const babelLoader = require('../babel');

    const part = babelLoader;

    expect(typeof part).toBe('object');
    expect(part.module.rules.length).toBe(0);
  });
});

describe('returns a webpack config object containing babel-loader', () => {
  test(`if 'webpack.babel.enable' config is true and file at 'webpack.babel.configPath' exists`, () => {
    const part = require('../babel');

    expect(typeof part).toBe('object');
    expect(part.module).toBeDefined();
    expect(part.module.rules).toBeDefined();
    expect(Array.isArray(part.module.rules)).toBeTruthy();
    expect(typeof part.module.rules[0]).toBe('object');
    expect(part.module.rules[0].options.extends).toBe('/some/path');
  });

  test(`whos 'exclude' value is set by the 'webpack.babel.exclude' config`, () => {
    global.slateUserConfig['webpack.babel.exclude'] = 'someValue';

    const part = require('../babel');

    expect(typeof part).toBe('object');
    expect(part.module).toBeDefined();
    expect(part.module.rules).toBeDefined();
    expect(Array.isArray(part.module.rules)).toBeTruthy();
    expect(typeof part.module.rules[0]).toBe('object');
    expect(part.module.rules[0].exclude).toBe(
      global.slateUserConfig['webpack.babel.exclude'],
    );
  });
});
