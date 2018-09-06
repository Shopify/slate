const path = require('path');
const os = require('os');
const commonPaths = require('@shopify/slate-config/common/paths.schema');

module.exports = {
  ...commonPaths,

  // Paths to exclude for all webpack loaders
  'webpack.commonExcludes': ['node_modules', 'assets/static/'],

  // Enable/disable Babel for theme scripts
  'babel.enable': true,

  // A path to a valid Babel configuration
  'babel.configPath': (config) =>
    path.join(config.get('paths.theme'), '.babelrc'),

  // Optimization settings for the cssnano plugin
  'cssnano.settings': {zindex: false},

  // Enable/disable the prompt to skip uploading settings_data.json
  'cli.promptSettings': true,

  // Object which contains entrypoints used in webpack's config.entry key
  'webpack.entrypoints': {
    static: path.resolve(__dirname, 'tools/webpack/static-files-glob.js'),
  },

  // Extends webpack development config using 'webpack-merge'
  // https://www.npmjs.com/package/webpack-merge
  'webpack.config.extend.dev': {},

  // Extends webpack production config using 'webpack-merge'
  // https://www.npmjs.com/package/webpack-merge
  'webpack.config.extend.prod': {},

  // Default port used for asset server. If it is not available, the next port
  // that is available is used.
  'network.startPort': 3000,

  // Path to Eslint bin executable
  'eslint.bin': path.resolve(__dirname, 'node_modules/.bin/eslint'),

  // Path to .eslintrc file
  'eslint.rc': (config) => path.resolve(config.get('paths.theme'), '.eslintrc'),

  // Path to .eslintignore file
  'eslint.ignore': (config) =>
    path.resolve(config.get('paths.theme'), '.eslintignore'),

  // Path to Eslint bin executable
  'stylelint.bin': path.resolve(__dirname, 'node_modules/.bin/stylelint'),

  // Path to .stylelintrc file
  'stylelint.rc': (config) =>
    path.resolve(config.get('paths.theme'), '.stylelintrc'),

  // Path to .stylelintignore file
  'stylelint.ignore': (config) =>
    path.resolve(config.get('paths.theme'), '.stylelintignore'),

  // Path to Prettier bin executable
  'prettier.bin': path.resolve(__dirname, 'node_modules/.bin/prettier'),

  // Path to .prettierrc file
  'prettier.rc': (config) =>
    path.resolve(config.get('paths.theme'), '.prettierrc'),

  // Path to .prettierignore file
  'prettier.ignore': (config) =>
    path.resolve(config.get('paths.theme'), '.prettierignore'),

  // Path to Themelint bin executable
  'themelint.bin': path.resolve(__dirname, 'node_modules/.bin/theme-lint'),

  // Path to self-signed SSL certificate which is used when developing
  // (browsersync, asset server) to avoid browsers rejecting requests based
  // on SSL
  'ssl.cert': path.resolve(os.homedir(), '.localhost_ssl/server.crt'),

  // Path to self-signed SSL key which is used when developing
  // (browsersync, asset server) to avoid browsers rejecting requests based
  // on SSL
  'ssl.key': path.resolve(os.homedir(), '.localhost_ssl/server.key'),
};
