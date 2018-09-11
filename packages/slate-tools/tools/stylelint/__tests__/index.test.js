jest.mock('child_process', () => ({execSync: jest.fn()}));

const {execSync} = require.requireMock('child_process');

describe('stylelint()', () => {
  beforeEach(() => {
    execSync.mockClear();
  });

  test(`executes the stylelint bin from the path specified in the 'stylelint.bin' config`, () => {
    const {stylelint} = require('../index');
    const SlateConfig = require('@shopify/slate-config');
    const config = new SlateConfig(require('../../../slate-tools.schema'));
    stylelint();
    expect(execSync).toHaveBeenCalledTimes(1);
    expect(execSync).toHaveBeenCalledWith(
      expect.stringContaining(config.get('stylelint.bin')),
      expect.anything(),
    );
  });

  test(`executes stylelint with the --config flag set to 'stylelint.config' config`, () => {
    const {stylelint} = require('../index');
    const SlateConfig = require('@shopify/slate-config');
    const config = new SlateConfig(require('../../../slate-tools.schema'));
    stylelint();
    expect(execSync).toHaveBeenCalledWith(
      expect.stringContaining(`--config ${config.get('stylelint.config')}`),
      expect.anything(),
    );
  });

  test(`executes stylelint with the --ignore-path flag set to 'stylelint.ignorePath' config`, () => {
    const {stylelint} = require('../index');
    const SlateConfig = require('@shopify/slate-config');
    const config = new SlateConfig(require('../../../slate-tools.schema'));
    stylelint();
    expect(execSync).toHaveBeenCalledWith(
      expect.stringContaining(
        `--ignore-path ${config.get('stylelint.ignorePath')}`,
      ),
      expect.anything(),
    );
  });

  test('executes stylelint with the --fix flag', () => {
    const {stylelint} = require('../index');
    stylelint({fix: true});
    expect(execSync).toHaveBeenCalledWith(
      expect.stringContaining('--fix'),
      expect.anything(),
    );
  });
});
