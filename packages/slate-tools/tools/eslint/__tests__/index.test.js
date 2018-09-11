jest.mock('child_process', () => ({execSync: jest.fn()}));

const {execSync} = require.requireMock('child_process');

describe('eslint()', () => {
  beforeEach(() => {
    execSync.mockClear();
  });

  test(`executes the Eslint bin from the path specified in the 'eslint.bin' config`, () => {
    const {eslint} = require('../index');
    const SlateConfig = require('@shopify/slate-config');
    const config = new SlateConfig(require('../../../slate-tools.schema'));

    eslint();

    expect(execSync).toHaveBeenCalledTimes(1);
    expect(execSync).toHaveBeenCalledWith(
      expect.stringContaining(config.get('eslint.bin')),
      expect.anything(),
    );
  });

  test(`executes Prettier with the --config flag set to 'eslint.config' config`, () => {
    const {eslint} = require('../index');
    const SlateConfig = require('@shopify/slate-config');
    const config = new SlateConfig(require('../../../slate-tools.schema'));

    eslint();

    expect(execSync).toHaveBeenCalledWith(
      expect.stringContaining(`--config ${config.get('eslint.config')}`),
      expect.anything(),
    );
  });

  test(`executes Prettier with the --ignore-path flag set to 'eslint.ignorePath' config`, () => {
    const {eslint} = require('../index');
    const SlateConfig = require('@shopify/slate-config');
    const config = new SlateConfig(require('../../../slate-tools.schema'));

    eslint();

    expect(execSync).toHaveBeenCalledWith(
      expect.stringContaining(
        `--ignore-path ${config.get('eslint.ignorePath')}`,
      ),
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
