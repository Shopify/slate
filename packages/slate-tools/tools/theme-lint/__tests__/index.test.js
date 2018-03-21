jest.mock('child_process', () => ({execSync: jest.fn()}));

const {execSync} = require.requireMock('child_process');

describe('themelint()', () => {
  beforeEach(() => {
    execSync.mockClear();
  });

  test('executes the themelint bin from slate-tools/node-modules directory', () => {
    const {themelint} = require('../index');
    const config = require('../../../slate-tools.config');
    themelint();
    expect(execSync).toHaveBeenCalledTimes(1);
    expect(execSync).toHaveBeenCalledWith(
      expect.stringContaining(config.paths.themelint.bin),
      expect.anything(),
    );
  });
});
