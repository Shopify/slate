jest.mock('child_process', () => ({execSync: jest.fn()}));

const {execSync} = require.requireMock('child_process');

describe('stylelint()', () => {
  beforeEach(() => {
    execSync.mockClear();
  });

  test('executes the stylelint bin from slate-tools/node-modules directory', () => {
    const {stylelint} = require('../index');
    const config = require('../../../slate-tools.config');
    stylelint();
    expect(execSync).toHaveBeenCalledTimes(1);
    expect(execSync).toHaveBeenCalledWith(
      expect.stringContaining(config.paths.stylelint.bin),
      expect.anything(),
    );
  });

  test('executes ESLint with the --fix flag', () => {
    const {stylelint} = require('../index');
    stylelint({fix: true});
    expect(execSync).toHaveBeenCalledWith(
      expect.stringContaining('--fix'),
      expect.anything(),
    );
  });
});
