const slateConfig = require('../index');
const fs = require('fs');
const schema = require('./fixtures/schema');
const slaterc = require('./fixtures/slaterc.json');

describe('.generate()', () => {
  describe('can generate a config object', () => {
    test('with default values', () => {
      const config = slateConfig.generate(schema);

      expect(config).toHaveProperty(
        schema.items[0].id,
        schema.items[0].default
      );
    });

    test('with slaterc overrides', () => {
      const oldReadFileSync = fs.readFileSync;

      fs.readFileSync = jest.fn(() => {
        return slaterc;
      });

      expect(slateConfig.generate(schema)).toHaveProperty(
        schema.items[0].id,
        'override-value'
      );

      fs.readFileSync = oldReadFileSync;
    });
  });
});
