jest.mock('inquirer', () => {
  return {prompt: jest.fn(() => Promise.resolve({ignoreSettingsData: true}))};
});

const inquirer = require.requireMock('inquirer');

describe('promptDisableExternalTesting()', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    global.slateUserConfig = {};
  });

  test(`does not prompt if 'cli.promptSettings' config is set to false`, async () => {
    const promptDisableExternalTesting = require('../disable-external-testing.js');

    global.slateUserConfig['network.externalTesting'] = false;

    await promptDisableExternalTesting();

    expect(inquirer.prompt).toHaveBeenCalledTimes(0);
  });

  test(`returns value 'localhost' if 'network.externalTesting' config is set to false`, async () => {
    const promptDisableExternalTesting = require('../disable-external-testing.js');

    global.slateUserConfig['network.externalTesting'] = false;

    const value = await promptDisableExternalTesting();

    expect(value).toBe('localhost');
  });
});
