const validate = require('../validate');
const schema = require('./fixtures/schema');
const slaterc = require('./fixtures/slaterc.json');

describe('validate()', () => {
  test('returns an validation results', () => {
    expect(validate(schema, slaterc)).toHaveProperty('errors');
    expect(validate(schema, slaterc)).toHaveProperty('warnings');
    expect(validate(schema, slaterc)).toHaveProperty('isValid');
  });

  describe('checks .slaterc with the following tests', () => {
    describe('test: isValidType', () => {
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
