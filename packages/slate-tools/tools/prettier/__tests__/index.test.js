jest.mock('child_process', () => ({exec: jest.fn()}));

const {exec} = require.requireMock('child_process');

describe('Prettier()', () => {
  beforeEach(() => {
    exec.mockClear();
  });

  test(`executes the Prettier bin from the path specified in the 'prettier.bin' config`, () => {
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

  test(`executes Prettier with the --config flag set to 'prettier.config' config`, () => {
    const {prettier} = require('../index');
    const SlateConfig = require('@shopify/slate-config');
    const config = new SlateConfig(require('../../../slate-tools.schema'));

    prettier();

    expect(exec).toHaveBeenCalledWith(
      expect.stringContaining(`--config ${config.get('prettier.config')}`),
      expect.anything(),
    );
  });

  test(`executes Prettier with the --ignore-path flag set to 'prettier.ignorePath' config`, () => {
    const {prettier} = require('../index');
    const SlateConfig = require('@shopify/slate-config');
    const config = new SlateConfig(require('../../../slate-tools.schema'));
    prettier();
    expect(exec).toHaveBeenCalledWith(
      expect.stringContaining(
        `--ignore-path ${config.get('prettier.ignorePath')}`,
      ),
      expect.anything(),
    );
  });
});
