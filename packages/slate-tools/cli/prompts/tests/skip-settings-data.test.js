const FILES = [
  '/config/settings_data.json',
  '/snippets/icon-youtube.liquid',
  '/layout/theme.liquid',
];

jest.mock('inquirer', () => {
  return {prompt: jest.fn(() => Promise.resolve({ignoreSettingsData: true}))};
});

jest.mock('@shopify/slate-env', () => {
  let __ignoreValue = '';
  return {
    __setIgnoreValue: (value) => (__ignoreValue = value),
    __resetIgnoreValue: () => (__ignoreValue = ''),
    getIgnoreFilesValue: () => __ignoreValue,
  };
});

const inquirer = require.requireMock('inquirer');
const env = require.requireMock('@shopify/slate-env');

describe('promptIfSettingsData()', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    env.__resetIgnoreValue();
  });

  test('prompts user if setting_data.json is not ignored in .env file and included in files to be uploaded', async () => {
    const promptIfSettingsData = require('../skip-settings-data');
    env.__setIgnoreValue('');
    await promptIfSettingsData(FILES);
    expect(inquirer.prompt).toHaveBeenCalledTimes(1);
  });

  test('does not prompt if --skipPrompts flag is used', () => {
    const promptIfSettingsData = require('../skip-settings-data');
    process.argv.push('--skipPrompts');

    promptIfSettingsData([]);
    expect(inquirer.prompt).toHaveBeenCalledTimes(0);

    process.argv.splice(process.argv.indexOf('--skipPrompts'), 1);
  });

  test('does not prompt if settings_data.json is not in the file list', async () => {
    const promptIfSettingsData = require('../skip-settings-data');
    env.__setIgnoreValue('');

    await promptIfSettingsData([]);

    expect(inquirer.prompt).toHaveBeenCalledTimes(0);
  });

  test('does not prompt if setting_data.json is ignored in .env file', async () => {
    const promptIfSettingsData = require('../skip-settings-data');
    const globs = [
      '/config/settings_data.json',
      'config/settings_data.json',
      '/config/*',
      '/config/*.json',
      '**/settings_data.json',
    ];

    await Promise.all(
      globs.map((glob) => {
        env.__setIgnoreValue(glob);
        return promptIfSettingsData(FILES);
      }),
    );

    expect(inquirer.prompt).toHaveBeenCalledTimes(0);
  });

  test(`does not prompt if 'cli.promptSettings' config is set to false`, async () => {
    jest.mock('../../../slate-tools.schema', () => {
      const schema = require.requireActual('../../../slate-tools.schema');
      schema['cli.promptSettings'] = false;
      return schema;
    });

    const promptIfSettingsData = require('../skip-settings-data');

    await promptIfSettingsData(FILES);

    expect(inquirer.prompt).toHaveBeenCalledTimes(0);
  });
});
