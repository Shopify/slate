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
      const config = slateConfig.generate(schema, mockSlateRc);

      expect(config).toHaveProperty(schema.items[0].id, 'override-value');
    });

    test('with the schema used to generate the config', () => {
      const config = slateConfig.generate(schema);

      expect(config).toHaveProperty('__schema');
      expect(config.__schema).toEqual(schema);
    });
  });
});
