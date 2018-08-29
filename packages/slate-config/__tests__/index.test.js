const path = require('path');

const originalCwd = process.cwd();
const schema = {
  'some.key': 'someValue',
  'some.other.key': 'someOtherValue',
  'some.function': jest.fn((config) => config.get('some.other.key')),
};

describe('SlateConfig()', () => {
  beforeEach(() => {
    process.chdir(originalCwd);
    jest.resetModules();
    global.slateUserConfig = null;
  });

  test('requires a first argument which is assigned to this.schema', () => {
    const SlateConfig = require('../index');
    const config = new SlateConfig(schema);

    expect(config.schema).toMatchObject(schema);
    expect(() => new SlateConfig()).toThrowError();
  });

  test('has an optional second argument which is assigned to this.userConfig', () => {
    const SlateConfig = require('../index');
    const userConfig = {
      'some.key': 'someNewValue',
    };
    const config = new SlateConfig(schema, userConfig);

    expect(config.userConfig).toBe(userConfig);
  });

  test('if a second argument is undefined, assigns the contents of a the slate.config.js file in the cwd to this.userConfig', () => {
    process.chdir(path.resolve(__dirname, './fixtures'));

    const SlateConfig = require('../index');
    const userConfig = require('./fixtures/slate.config');
    const config = new SlateConfig(schema);

    expect(config.userConfig).toMatchObject(userConfig);
  });

  test('copies the values of this.userConfig into this.schema, replacing any exisiting values', () => {
    const SlateConfig = require('../index');
    const userConfig = {
      'some.key': 'someNewValue',
    };
    const config = new SlateConfig(schema, userConfig);

    expect(config.schema).toMatchObject(config.userConfig);
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

  test('if the value is a function, it is replaced with the returned value of that function after .get() has been called', () => {
    const SlateConfig = require('../index');
    const config = new SlateConfig(schema);
    const value = config.get('some.function');

    expect(config.schema['some.function']).toBe(value);
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
