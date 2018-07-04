const slateConfig = require('@shopify/slate-config');

module.exports = slateConfig.generate({
  id: 'slateEnv',
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
      description: 'The myshopify.com URL to your Shopify store',
      type: 'string',
    },
    {
      id: 'envPasswordVar',
      default: 'SLATE_PASSWORD',
      description: 'The API password generated from a Private App',
      type: 'string',
    },
    {
      id: 'envThemeIdVar',
      default: 'SLATE_THEME_ID',
      description: 'The ID of the theme you wish to upload files to',
      type: 'string',
    },
    {
      id: 'envIgnoreFilesVar',
      default: 'SLATE_IGNORE_FILES',
      description:
        "A list of file patterns to ignore, with each list item separated by ':'",
      type: 'string',
    },
    {
      id: 'envUserEmail',
      default: 'SLATE_USER_EMAIL',
      description: 'The email of the user to register for Slate analytics',
      type: 'string',
    },
  ],
});
