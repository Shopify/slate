const path = require('path');

const originalCwd = process.cwd();
const schema = {
  'some.key': 'someValue',
  'some.other.key': 'someOtherValue',
  'some.function': jest.fn((config) => config.get('some.other.key')),
};

beforeEach(() => {
  process.chdir(originalCwd);
  global.slateUserConfig = null;
  global.slateConfigPath = null;
  jest.resetModules();
});

describe('when the file first is executed it', () => {
  test('looks for slate.config.js in process.cwd and assigns its contents to a global variable global.slateUserConfig', () => {
    process.chdir(path.resolve(__dirname, './fixtures'));

    const userConfig = require('./fixtures/slate.config');

    require('../index');

    expect(global.slateUserConfig).toBeDefined();
    expect(global.slateUserConfig).toMatchObject(userConfig);
  });

  test('looks for a slate.config.js file if global.slateConfigPath is defined', () => {
    global.slateConfigPath = path.resolve(
      __dirname,
      'fixtures/slate.config.js',
    );

    const userConfig = require('./fixtures/slate.config');

    require('../index');

    expect(global.slateUserConfig).toBeDefined();
    expect(global.slateUserConfig).toMatchObject(userConfig);
  });

  test('if slate.config.js does not exist at process.cwd or the value specified by global.slateConfigPath, an empty object is returned', () => {
    require('../index');

    expect(global.slateUserConfig).toBeDefined();
    expect(global.slateUserConfig).toMatchObject({});
  });

  test('throws error if there is an error in the slate.config.js file', () => {
    global.slateConfigPath = path.resolve(
      __dirname,
      'fixtures/slateWithError.config.js',
    );

    expect(() => {
      require('../index');
    }).toThrowError(ReferenceError);
  });
});

describe('SlateConfig()', () => {
  test('requires a first argument which is assigned to this.schema', () => {
    const SlateConfig = require('../index');
    const config = new SlateConfig(schema);

    expect(config.schema).toMatchObject(schema);
    expect(() => new SlateConfig()).toThrowError();
  });

  test('SlateConfig.prototype.userConfig is a shortcut to global.slateUserConfig', () => {
    process.chdir(path.resolve(__dirname, './fixtures'));

    const SlateConfig = require('../index');
    const config = new SlateConfig(schema);

    expect(config.userConfig).toMatchObject(global.slateUserConfig);
  });

  test('does not modify the original schema object', () => {
    const SlateConfig = require('../index');
    const config = new SlateConfig(schema);

    config.get('some.function');

    expect(config.schema).not.toBe(schema);
  });
});

describe('SlateConfig.get()', () => {
  test('fetches the value of the provided key', () => {
    const SlateConfig = require('../index');
    const config = new SlateConfig(schema);

    expect(config.get('some.other.key')).toBe(schema['some.other.key']);
  });

  test('if the value is a function, the function is executed with the config instance as the only argument', () => {
    const SlateConfig = require('../index');
    const config = new SlateConfig(schema);
    const value = config.get('some.function');

    expect(schema['some.function']).toBeCalledWith(config);
    expect(value).toBe(schema['some.other.key']);
  });
});

describe('SlateConfig.set()', () => {
  test('sets the value of a config for a given key', () => {
    const SlateConfig = require('../index');
    const config = new SlateConfig(schema);

    config.set('some.new.key', 'someNewValue');

    expect(config.schema['some.new.key']).toBe('someNewValue');
  });

  test('throws an error if key has already been set, unless override boolean has been explicitely set', () => {
    const SlateConfig = require('../index');
    const config = new SlateConfig(schema);

    expect(() => config.set('some.key', 'someOtherValue')).toThrowError();
  });
});
