const validate = require('../validate');
const schema = require('./fixtures/testSchema');
const slaterc = require('./fixtures/slate.config.js');

describe('validate()', () => {
  test('returns an validation results', () => {
    expect(validate(schema, slaterc)).toHaveProperty('errors');
    expect(validate(schema, slaterc)).toHaveProperty('warnings');
    expect(validate(schema, slaterc)).toHaveProperty('isValid');
  });

  describe('checks .slaterc with the following tests', () => {
    describe('test: isValidType', () => {
      test('validates item of type array when read from json', () => {
        const json = '{"test-array": ["item1", "item2", "item3"]}';
        const slatercWithArray = JSON.parse(json);

        const results = validate(schema, slatercWithArray);
        expect(results).toHaveProperty('isValid');
        expect(results.isValid).toEqual(true);
      });

      test('returns error if invalid type is provided', () => {
        const invalidSlateRc = Object.assign({}, slaterc, {
          'test-item': [],
        });
        const results = validate.tests.isValidType(schema, invalidSlateRc);
        expect(results.errors.length).toBeGreaterThan(0);
      });
    });
  });
});
