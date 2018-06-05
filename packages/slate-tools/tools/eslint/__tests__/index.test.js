jest.mock('child_process', () => ({execSync: jest.fn()}));

const {execSync} = require.requireMock('child_process');

describe('eslint()', () => {
  beforeEach(() => {
    execSync.mockClear();
  });

  test('executes the ESLint bin found in slate-tools/node_modules', () => {
    const {eslint} = require('../index');
    const config = require('../../../slate-tools.config');
    eslint();
    expect(execSync).toHaveBeenCalledTimes(1);
    expect(execSync).toHaveBeenCalledWith(
      expect.stringContaining(config.paths.eslint.bin),
      expect.anything(),
    );
  });

  test('caches test results for quicker repeated executiong', () => {
    const {eslint} = require('../index');
    eslint();
    expect(execSync).toHaveBeenCalledWith(
      expect.stringContaining('--cache true --cache-location'),
      expect.anything(),
    );
  });

  test('executes ESLint with no warnings', () => {
    const {eslint} = require('../index');
    eslint();
    expect(execSync).toHaveBeenCalledWith(
      expect.stringContaining('--max-warnings 0'),
      expect.anything(),
    );
  });

  test('executes ESLint with the --fix flag', () => {
    const {eslint} = require('../index');
    eslint({fix: true});
    expect(execSync).toHaveBeenCalledWith(
      expect.stringContaining('--fix'),
      expect.anything(),
    );
  });
});
