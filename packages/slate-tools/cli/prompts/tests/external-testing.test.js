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
    const promptDisableExternalTesting = require('../external-testing.js');

    global.slateUserConfig['network.externalTesting'] = false;

    await promptDisableExternalTesting();

    expect(inquirer.prompt).toHaveBeenCalledTimes(0);
  });

  test(`returns false if 'network.externalTesting' config is set to false`, async () => {
    const promptDisableExternalTesting = require('../external-testing.js');

    global.slateUserConfig['network.externalTesting'] = false;

    expect(await promptDisableExternalTesting()).toBeFalsy();
  });

  test("returns true if 'network.externalTesting' and 'network.externalTesting.address' are truthy", async () => {
    const promptDisableExternalTesting = require('../external-testing.js');

    global.slateUserConfig['network.externalTesting'] = true;
    global.slateUserConfig['network.externalTesting.address'] =
      'local.slate.com';

    expect(await promptDisableExternalTesting()).toBeTruthy();
  });
});
