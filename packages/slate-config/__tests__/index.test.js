const slateConfig = require('../index');
const schema = require('./fixtures/schema');

describe('.generate()', () => {
  describe('can generate a config object', () => {
    test('with default values', () => {
      const config = slateConfig.generate(schema);

      expect(config).toHaveProperty(
        schema.items[0].id,
        schema.items[0].default,
      );
    });

    test('with slaterc overrides', () => {
      const mockSlateRc = require('./fixtures/slate.config.js');

      expect(slateConfig.generate(schema, mockSlateRc)).toHaveProperty(
        schema.items[0].id,
        'override-value',
      );
    });
  });
});
