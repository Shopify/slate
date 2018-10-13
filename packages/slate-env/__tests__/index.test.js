const fs = require('fs');
const path = require('path');
const glob = require('glob');
const dotenv = require('dotenv');
const SlateConfig = require('@shopify/slate-config');

const slateEnv = require('../index');
const config = new SlateConfig(require('../slate-env.schema'));

const envPath = path.resolve(
  config.get('env.rootDirectory'),
  config.get('env.basename'),
);

const TEST_ENV = {
  [config.get('env.keys.name')]: 'production',
  [config.get('env.keys.store')]: 'test-shop.myshopify.com',
  [config.get('env.keys.password')]: '123456789',
  [config.get('env.keys.themeId')]: '987654321',
  [config.get('env.keys.ignoreFiles')]: 'config/settings_data.json',
  [config.get('env.keys.userEmail')]: 'test@email.com',
};

function setVars(vars) {
  for (const key in vars) {
    if (vars.hasOwnProperty(key)) {
      process.env[key] = vars[key];
    }
  }
}

function clearVars(vars) {
  for (const key in vars) {
    if (vars.hasOwnProperty(key)) {
      delete process.env[key];
    }
  }
}

afterEach(() => {
  clearVars(TEST_ENV);
  glob.sync(`${envPath}*`).forEach((file) => fs.unlinkSync(file));
});

describe('Slate Env', () => {
  describe('clear()', () => {
    beforeEach(() => {
      setVars(TEST_ENV);
    });

    test('Clears all the values assigned to Slate environment variables', () => {
      slateEnv.clear();

      for (const key in TEST_ENV) {
        if (TEST_ENV.hasOwnProperty(key)) {
          expect(process.env[key]).toBe('');
        }
      }
    });
  });

  describe('getSlateEnv()', () => {
    beforeEach(() => {
      setVars(TEST_ENV);
    });

    test('returns object containing all env variables without current values', () => {
      expect(slateEnv.getSlateEnv()).toEqual(TEST_ENV);
    });
  });

  describe('getDefaultSlateEnv', () => {
    test('returns an object which contains the default variables and values of an env file', () => {
      const emptyTestVars = {
        [config.get('env.keys.store')]: '',
        [config.get('env.keys.password')]: '',
        [config.get('env.keys.themeId')]: '',
        [config.get('env.keys.ignoreFiles')]: '',
      };

      expect(slateEnv.getDefaultSlateEnv()).toEqual(emptyTestVars);
    });
  });

  describe('getEmptySlateEnv()', () => {
    test('returns object containing all env file variables with empty values', () => {
      const emptyTestVars = Object.assign({}, TEST_ENV);

      for (const key in emptyTestVars) {
        if (emptyTestVars.hasOwnProperty(key)) {
          emptyTestVars[key] = '';
        }
      }

      expect(slateEnv.getEmptySlateEnv()).toEqual(emptyTestVars);
    });
  });

  describe('create()', () => {
    describe('generates an .env file', () => {
      test('with empty config values', () => {
        slateEnv.create();

        const envParsed = dotenv.parse(fs.readFileSync(envPath, 'utf8'));

        expect(envParsed).toEqual({
          [config.get('env.keys.store')]: '',
          [config.get('env.keys.password')]: '',
          [config.get('env.keys.themeId')]: '',
          [config.get('env.keys.ignoreFiles')]: '',
        });
      });

      test('with specified config values', () => {
        const env = slateEnv.getEmptySlateEnv();
        const store = 'test-shop.myshopify.com';

        env[config.get('env.keys.store')] = store;
        slateEnv.create({values: env});

        const envParsed = dotenv.parse(fs.readFileSync(envPath, 'utf8'));

        expect(envParsed).toHaveProperty(config.get('env.keys.store'), store);
      });

      test('with invalid config values ommited', () => {
        const env = slateEnv.getEmptySlateEnv();
        const store = 'test-shop.myshopify.com';
        const invalidKey = 'INVALID_VARIABLE';
        const invalidValue = 'some value';

        env[config.get('env.keys.store')] = store;
        env[invalidKey] = invalidValue;
        slateEnv.create({values: env});

        const envParsed = dotenv.parse(fs.readFileSync(envPath, 'utf8'));

        expect(envParsed).toHaveProperty(config.get('env.keys.store'), store);
        expect(envParsed).not.toHaveProperty(invalidKey, invalidValue);
      });

      test('when a valid name is provided', () => {
        const name = 'production';
        const namedEnvPath = envPath.concat(`.${name}`);

        slateEnv.create({name});
        expect(fs.existsSync(namedEnvPath)).toBeTruthy();
      });

      test('when no name is provided', () => {
        slateEnv.create();
        expect(fs.existsSync(envPath)).toBeTruthy();
      });

      test('when an empty name ("") is provided', () => {
        slateEnv.create({}, '');
        expect(fs.existsSync(envPath)).toBeTruthy();
      });

      test('when a whitespace name (" ") is provided', () => {
        slateEnv.create({}, ' ');
        expect(fs.existsSync(envPath)).toBeTruthy();
      });
    });
  });

  describe('assign()', () => {
    beforeEach(() => {
      slateEnv.create({values: TEST_ENV});
      slateEnv.create({values: TEST_ENV, name: 'production'});
    });

    test('reads default env file and assigns values to environment variables', () => {
      slateEnv.assign();
      expect(process.env[config.get('env.keys.store')]).toBe(
        TEST_ENV[config.get('env.keys.store')],
      );
    });

    test('reads named env file and assigns values to environment variables', () => {
      slateEnv.assign('production');
      expect(process.env[config.get('env.keys.store')]).toBe(
        TEST_ENV[config.get('env.keys.store')],
      );
    });

    test('does not overwrite an environment variable if it already has a value', () => {
      const store = 'other-value.myshopify.com';
      process.env[config.get('env.keys.store')] = store;
      slateEnv.assign();

      expect(process.env[config.get('env.keys.store')]).toBe(store);
    });

    test("throw an error if a name is provided and the env file doesn't exist", () => {
      expect(() => slateEnv.assign('nope')).toThrow();
    });
  });

  describe('getEnvName()', () => {
    describe('if a env name is specified', () => {
      beforeEach(() => {
        slateEnv.create({values: TEST_ENV, name: 'production'});
        slateEnv.assign('production');
      });

      test('returns the name of the environment', () => {
        expect(slateEnv.getEnvNameValue()).toBe('production');
      });
    });

    describe('if a env name is not specified', () => {
      test(`returns the name '${config.get(
        'env.defaultEnvName',
      )}' if the default env file is present`, () => {
        slateEnv.create(TEST_ENV);
        slateEnv.assign();
        expect(slateEnv.getEnvNameValue()).toBe(
          config.get('env.defaultEnvName'),
        );
      });
      test(`returns the name '${config.get(
        'env.externalEnvName',
      )}' if the default env file is not present`, () => {
        slateEnv.assign();
        expect(slateEnv.getEnvNameValue()).toBe(
          config.get('env.externalEnvName'),
        );
      });
    });
  });

  describe('getStoreValue()', () => {
    test('returns the value of the environment variable that references the store URL', () => {
      process.env[config.get('env.keys.store')] =
        TEST_ENV[config.get('env.keys.store')];
      expect(slateEnv.getStoreValue()).toBe(
        TEST_ENV[config.get('env.keys.store')],
      );
    });

    test('returns an empty string if the value is undefined', () => {
      expect(slateEnv.getStoreValue()).toBe('');
    });
  });

  describe('getPasswordValue()', () => {
    test('returns the value of the environment variable that references the store API password', () => {
      process.env[config.get('env.keys.password')] =
        TEST_ENV[config.get('env.keys.password')];
      expect(slateEnv.getPasswordValue()).toBe(
        TEST_ENV[config.get('env.keys.password')],
      );
    });

    test('returns an empty string if the value is undefined', () => {
      expect(slateEnv.getPasswordValue()).toBe('');
    });
  });

  describe('getThemeIdValue()', () => {
    test('returns the value of the environment variable that references the store theme ID', () => {
      process.env[config.get('env.keys.themeId')] =
        TEST_ENV[config.get('env.keys.themeId')];
      expect(slateEnv.getThemeIdValue()).toBe(
        TEST_ENV[config.get('env.keys.themeId')],
      );
    });

    test('returns an empty string if the value is undefined', () => {
      expect(slateEnv.getThemeIdValue()).toBe('');
    });
  });

  describe('getIgnoreFilesValue()', () => {
    test('returns the value of the environment variable that references a list of files to ignore', () => {
      process.env[config.get('env.keys.ignoreFiles')] =
        TEST_ENV[config.get('env.keys.ignoreFiles')];
      expect(slateEnv.getIgnoreFilesValue()).toBe(
        TEST_ENV[config.get('env.keys.ignoreFiles')],
      );
    });

    test('returns an empty string if the value is undefined', () => {
      expect(slateEnv.getIgnoreFilesValue()).toBe('');
    });
  });

  describe('validate()', () => {
    describe('returns an object with an .isValid prop', () => {
      test('that is true if no validation .errors is empty', () => {
        setVars(TEST_ENV);
        const result = slateEnv.validate();
        expect(result).toHaveProperty('isValid', true);
        expect(result.errors).toBeDefined();
        expect(result.errors).toHaveLength(0);
      });

      test('that is false validation .errors is not empty', () => {
        const result = slateEnv.validate();
        expect(result).toHaveProperty('isValid', false);
        expect(result.errors).toBeDefined();
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });
    describe('returns errors if', () => {
      test('the store URL environment variable is empty', () => {
        setVars(
          Object.assign({}, TEST_ENV, {
            [config.get('env.keys.store')]: '',
          }),
        );
        const result = slateEnv.validate();
        expect(result.errors).toHaveLength(1);
      });

      test('the store URL environment variable is not a .myshopify.com or myshopify.io URL', () => {
        ['shop1.myshopify.com', 'shop1.myshopify.io', 'shop1'].forEach(
          (value) => {
            setVars(
              Object.assign({}, TEST_ENV, {
                [config.get('env.keys.store')]: value,
              }),
            );
            const result = slateEnv.validate();
            expect(result.errors).toHaveLength(value === 'shop1' ? 1 : 0);
          },
        );
      });

      test('the store URL environment variable does not end with a trailing slash', () => {
        ['shop1.myshopify.com', 'shop1.myshopify.com/'].forEach((value) => {
          setVars(
            Object.assign({}, TEST_ENV, {
              [config.get('env.keys.store')]: value,
            }),
          );
          const result = slateEnv.validate();
          expect(result.errors).toHaveLength(
            value === 'shop1.myshopify.com/' ? 1 : 0,
          );
        });
      });

      test('the store API password environment variable is empty', () => {
        setVars(
          Object.assign({}, TEST_ENV, {
            [config.get('env.keys.password')]: '',
          }),
        );
        const result = slateEnv.validate();
        expect(result.errors).toHaveLength(1);
      });

      test('the store API password environment variable has invalid characters', () => {
        setVars(
          Object.assign({}, TEST_ENV, {
            [config.get('env.keys.password')]: '8h1j-dnjn8',
          }),
        );
        const result = slateEnv.validate();
        expect(result.errors).toHaveLength(1);
      });

      test('the store Theme ID environment variable is empty', () => {
        setVars(
          Object.assign({}, TEST_ENV, {
            [config.get('env.keys.themeId')]: '',
          }),
        );
        const result = slateEnv.validate();
        expect(result.errors).toHaveLength(1);
      });

      test("the store Theme ID environment variable is not 'live' or a string of numbers", () => {
        setVars(
          Object.assign({}, TEST_ENV, {
            [config.get('env.keys.themeId')]: 'ds7dsh8d',
          }),
        );
        const result = slateEnv.validate();
        expect(result.errors).toHaveLength(1);
      });
    });
  });
});
