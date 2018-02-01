jest.mock('../config');

const MOCK_VALID_SLATE_RC = {
  uuid: '9a983jf94jk42',
  version: '1.0.0-pre-alpha.19',
};

beforeEach(() => jest.resetModules());

afterEach(() => require('mock-fs').restore());

describe('get()', () => {
  describe('if .slaterc exists in the `~/` directory', () => {
    test('returns its parsed JSON contents', () => {
      const slateRc = require('../index');
      const mock = require('mock-fs');
      const config = require('../config');

      mock({[config.slateRcPath]: JSON.stringify(MOCK_VALID_SLATE_RC)});

      expect(slateRc.get()).toMatchObject(MOCK_VALID_SLATE_RC);
    });

    test('throws an error if the JSON file is invalid', () => {
      const slateRc = require('../index');
      const SlateRcError = require('../slate-rc-error');
      const config = require('../config');
      const mock = require('mock-fs');

      mock({[config.slateRcPath]: 'some invalid JSON'});

      expect(() => {
        slateRc.get();
      }).toThrowError(SlateRcError);
    });

    test('returns null if file is empty', () => {
      const slateRc = require('../index');
      const config = require('../config');
      const mock = require('mock-fs');

      mock({[config.slateRcPath]: ''});

      expect(slateRc.get()).toBe(null);
    });
  });

  describe('if a .slaterc file does not exist in the `~/` ', () => {
    test('returns null', () => {
      const slateRc = require('../index');
      const results = slateRc.get();

      expect(results).toBe(null);
    });
  });
});

describe('generate()', () => {
  test('creates a .slaterc file in the `~/` directory', () => {
    const slateRc = require('../index');
    const config = require('../config');
    const mock = require('mock-fs');
    const fs = require('fs');

    mock();

    slateRc.generate('1.0.0');

    expect(fs.existsSync(config.slateRcPath)).toBeTruthy();

    const content = JSON.parse(fs.readFileSync(config.slateRcPath));

    expect(content.uuid).toBeDefined();
    expect(content.version).toBeDefined();
  });

  describe('throws an error if', () => {
    test('empty version string is passed', () => {
      const slateRc = require('../index');
      const SlateRcError = require('../slate-rc-error');
      const mock = require('mock-fs');

      mock();

      expect(() => {
        slateRc.generate();
      }).toThrowError(SlateRcError);
    });

    test('invalid version string is passed', () => {
      const slateRc = require('../index');
      const SlateRcError = require('../slate-rc-error');
      const mock = require('mock-fs');

      mock();

      expect(() => {
        slateRc.generate('100');
      }).toThrowError(SlateRcError);
    });

    test('empty uuid string is passed', () => {
      const slateRc = require('../index');
      const SlateRcError = require('../slate-rc-error');
      const mock = require('mock-fs');

      mock();

      expect(() => {
        slateRc.generate('1.0.0', ' ');
      }).toThrowError(SlateRcError);
    });
  });
});
