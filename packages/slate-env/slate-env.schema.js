const path = require('path');
const commonPaths = require('@yourwishes/slate-config/common/paths.schema');

module.exports = {
  ...commonPaths,

  // Root directory to look for .env file
  'env.rootDirectory': (config) => config.get('paths.theme'),

  // The filename of the default env file
  'env.basename': '.env',

  // Path to default .env file
  'env.path': (config) =>
    path.resolve(config.get('env.rootDirectory'), config.get('env.filename')),

  // The name of the environment when using the default env file
  'env.defaultEnvName': 'default',

  // The name of the environment when no env file is present
  'env.externalEnvName': 'external',

  // The environment variable key which contains the name of the environment
  // Slate is running in
  'env.keys.name': 'SLATE_ENV_NAME',

  // The environment variable key which contains the myshopify.com URL to your
  // Shopify store
  'env.keys.store': 'SLATE_STORE',

  // The environment variable key which contains the API password generated from
  // a Private App
  'env.keys.password': 'SLATE_PASSWORD',

  // The environment variable key which contains the ID of the theme you wish to
  // upload files to
  'env.keys.themeId': 'SLATE_THEME_ID',

  // The environment variable key which contains a list of file patterns to
  // ignore, with each list item separated by ':'
  'env.keys.ignoreFiles': 'SLATE_IGNORE_FILES',

  // The environment variable key which contains the timeout of themekit upload
  // Timeout upload is
  'env.keys.timeout': 'SLATE_TIMEOUT',
};
