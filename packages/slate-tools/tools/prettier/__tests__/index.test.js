jest.mock('child_process', () => ({exec: jest.fn()}));

const {exec} = require.requireMock('child_process');

describe('eslint()', () => {
  beforeEach(() => {
    exec.mockClear();
  });

  test('executes the Prettier bin found in slate-tools/node_modules', () => {
    const {prettier} = require('../index');
    const config = require('../../../slate-tools.config');
    prettier();
    expect(exec).toHaveBeenCalledTimes(1);
    expect(exec).toHaveBeenCalledWith(
      expect.stringContaining(config.paths.prettier.bin),
      expect.anything(),
    );
  });
});
