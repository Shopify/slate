const slateConfig = require('../index');
const testSchema = require('./fixtures/testSchema');
const otherSchema = require('./fixtures/otherSchema');

describe('.generate()', () => {
  describe('can generate a config object', () => {
    test('with default values', () => {
      const config = slateConfig.generate(testSchema);

      expect(config).toHaveProperty(
        testSchema.items[0].id,
        testSchema.items[0].default,
      );
    });

    test('with slaterc overrides', () => {
      const mockSlateRc = require('./fixtures/slate.config.js');
      const config = slateConfig.generate(testSchema, mockSlateRc);

      expect(config).toHaveProperty(testSchema.items[0].id, 'override-value');
    });

    test('with namespaced settings', () => {
      const mockSlateRc = require('./fixtures/slate.config.js');
      const config1 = slateConfig.generate(testSchema, mockSlateRc);
      const config2 = slateConfig.generate(otherSchema, mockSlateRc);

      expect(config1).toHaveProperty(
        testSchema.items[0].id,
        mockSlateRc[testSchema.id][testSchema.items[0].id],
      );
      expect(config2).toHaveProperty(
        otherSchema.items[0].id,
        mockSlateRc[otherSchema.id][otherSchema.items[0].id],
      );
    });

    test('with the schema used to generate the config', () => {
      const config = slateConfig.generate(testSchema);

      expect(config).toHaveProperty('__schema');
      expect(config.__schema).toEqual(testSchema);
    });
  });
});
