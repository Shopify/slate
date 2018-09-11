const path = require('path');
const os = require('os');
const commonPaths = require('@shopify/slate-config/common/paths.schema');

module.exports = {
  ...commonPaths,

  // Enable/disable the prompt to skip uploading settings_data.json
  'cli.promptSettings': true,

  // Path to Eslint bin executable
  'eslint.bin': path.resolve(__dirname, 'node_modules/.bin/eslint'),

  // Path to .eslintignore file
  'eslint.ignore': (config) =>
    path.resolve(config.get('paths.theme'), '.eslintignore'),

  // Path to .eslintrc file
  'eslint.rc': (config) => path.resolve(config.get('paths.theme'), '.eslintrc'),

  // Default port used for asset server. If it is not available, the next port
  // that is available is used.
  'network.startPort': 3000,

  // Path to Prettier bin executable
  'prettier.bin': path.resolve(__dirname, 'node_modules/.bin/prettier'),

  // Path to .prettierrc file
  'prettier.config': (config) =>
    path.resolve(config.get('paths.theme'), '.prettierrc'),

  // Path to .prettierignore file
  'prettier.ignorePath': (config) =>
    path.resolve(config.get('paths.theme'), '.prettierignore'),

  // Path to self-signed SSL certificate which is used when developing
  // (browsersync, asset server) to avoid browsers rejecting requests based
  // on SSL
  'ssl.cert': path.resolve(os.homedir(), '.localhost_ssl/server.crt'),

  // Path to self-signed SSL key which is used when developing
  // (browsersync, asset server) to avoid browsers rejecting requests based
  // on SSL
  'ssl.key': path.resolve(os.homedir(), '.localhost_ssl/server.key'),

  // Path to Eslint bin executable
  'stylelint.bin': path.resolve(__dirname, 'node_modules/.bin/stylelint'),

  // Path to .stylelintrc file
  'stylelint.config': (config) =>
    path.resolve(config.get('paths.theme'), '.stylelintrc'),

  // Path to .stylelintignore file
  'stylelint.ignorePath': (config) =>
    path.resolve(config.get('paths.theme'), '.stylelintignore'),

  // Path to Themelint bin executable
  'themelint.bin': path.resolve(__dirname, 'node_modules/.bin/theme-lint'),

  // Include babel-loader in the webpack core config
  'webpack.babel.enable': true,

  // A path to a valid Babel configuration. File must exist for Babel to be enabled.
  'webpack.babel.configPath': (config) =>
    path.join(config.get('paths.theme'), '.babelrc'),

  // Paths to exclude for all webpack loaders
  'webpack.commonExcludes': ['node_modules', 'assets/static/'],

  // Extends webpack development config using 'webpack-merge'
  // https://www.npmjs.com/package/webpack-merge
  'webpack.config.extend.dev': {},

  // Extends webpack production config using 'webpack-merge'
  // https://www.npmjs.com/package/webpack-merge
  'webpack.config.extend.prod': {},

  // Optimization settings for the cssnano plugin
  'webpack.cssnano.settings': {zindex: false},

  // Object which contains entrypoints used in webpack's config.entry key
  'webpack.entrypoints': {
    static: path.resolve(__dirname, 'tools/webpack/static-files-glob.js'),
  },
};
