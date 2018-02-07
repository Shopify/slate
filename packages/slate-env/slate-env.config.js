const slateConfig = require('@shopify/slate-config');

module.exports = slateConfig.generate({
  items: [
    {
      id: 'envRootDir',
      default: slateConfig.resolveTheme('./'),
      description: 'Root directory to look for .env file',
      type: 'string',
    },
    {
      id: 'envDefaultFileName',
      default: '.env',
      description: 'The filename of the defauly env file',
      type: 'string',
    },
    {
      id: 'envDefaultEnvName',
      default: 'default',
      description:
        'The name of the environment when using the default env file',
      type: 'string',
    },
    {
      id: 'envExternalEnvName',
      default: 'external',
      description: 'The name of the environment when no env file is present',
      type: 'string',
    },
    {
      id: 'envNameVar',
      default: 'SLATE_ENV_NAME',
      description: 'The name of the environment Slate is running in',
      type: 'string',
    },
    {
      id: 'envStoreVar',
      default: 'SLATE_STORE',
      description: 'The environment variable used to reference the store URL',
      type: 'string',
    },
    {
      id: 'envPasswordVar',
      default: 'SLATE_PASSWORD',
      description:
        'The environment variable used to reference the store API password',
      type: 'string',
    },
    {
      id: 'envThemeIdVar',
      default: 'SLATE_THEME_ID',
      description: 'The environment variable used to reference the store URL',
      type: 'string',
    },
    {
      id: 'envIgnoreFilesVar',
      default: 'SLATE_IGNORE_FILES',
      description:
        'The environment variable used to reference a list of files, seperated by ":", to ignore',
      type: 'string',
    },
  ],
});
