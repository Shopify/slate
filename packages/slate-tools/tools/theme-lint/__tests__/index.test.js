jest.mock('child_process', () => ({execSync: jest.fn()}));

const {execSync} = require.requireMock('child_process');

describe('themelint()', () => {
  beforeEach(() => {
    execSync.mockClear();
  });

  test(`executes the themelint bin specified in 'themelint.bin' config`, () => {
    const {themelint} = require('../index');
    const SlateConfig = require('@shopify/slate-config');
    const config = new SlateConfig(require('../../../slate-tools.schema'));

    themelint();
    expect(execSync).toHaveBeenCalledTimes(1);
    expect(execSync).toHaveBeenCalledWith(
      expect.stringContaining(config.get('themelint.bin')),
      expect.anything(),
    );
  });
});
