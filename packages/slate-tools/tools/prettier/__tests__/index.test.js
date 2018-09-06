jest.mock('child_process', () => ({exec: jest.fn()}));

const {exec} = require.requireMock('child_process');

describe('eslint()', () => {
  beforeEach(() => {
    exec.mockClear();
  });

  test('executes the Prettier bin found in slate-tools/node_modules', () => {
    const {prettier} = require('../index');
    const SlateConfig = require('@shopify/slate-config');
    const config = new SlateConfig(require('../../../slate-tools.schema'));

    prettier();
    expect(exec).toHaveBeenCalledTimes(1);
    expect(exec).toHaveBeenCalledWith(
      expect.stringContaining(config.get('prettier.bin')),
      expect.anything(),
    );
  });
});
