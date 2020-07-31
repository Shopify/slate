const path = require('path');
const os = require('os');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const commonPaths = require('@shopify/slate-config/common/paths.schema');

module.exports = {
  ...commonPaths,

  // Enable/disable the prompt to skip uploading settings_data.json
  'cli.promptSettings': true,

  // Slate will reference files using your local IP address instead of localhost.
  // This is mostly to get around SSL complications when trying to preview
  // your development store from an external device like your phone. Use this
  // config if you want to disable using your local IP and external testing.
  'network.externalTesting': true,

  // If 'network.externalTesting' is true, the defaultaddress used to to
  // reference local files will be your local IP address. Set this value
  // if you wish to specify another network address.
  'network.externalTesting.address': null,

  // Default port used for asset server. If it is not available, the next port
  // that is available is used.
  'network.startPort': 3000,

  // Path to self-signed SSL certificate which is used when developing
  // (browsersync, asset server) to avoid browsers rejecting requests based
  // on SSL
  'ssl.cert': path.resolve(os.homedir(), '.localhost_ssl/server.crt'),

  // Path to self-signed SSL key which is used when developing
  // (browsersync, asset server) to avoid browsers rejecting requests based
  // on SSL
  'ssl.key': path.resolve(os.homedir(), '.localhost_ssl/server.key'),

  // Include babel-loader in the webpack core config
  'webpack.babel.enable': true,

  // A path to a valid Babel configuration. File must exist for Babel to be enabled.
  'webpack.babel.configPath': (config) =>
    path.join(config.get('paths.theme'), '.babelrc'),

  // Sometimes packages in node_modules need to be transpiled by Babel. To
  // allow this, change this config option so that it includes the following pattern:
  //
  // /node_modules\/(?!(MY-MODULE|ANOTHER-ONE)\/).*/
  //
  // See https://github.com/webpack/webpack/issues/2031 for more details
  'webpack.babel.exclude': (config) => config.get('webpack.commonExcludes'),

  // Paths to exclude for all webpack loaders
  'webpack.commonExcludes': [/node_modules/, /assets\/static/],

  // Extends webpack development config using 'webpack-merge'
  // https://www.npmjs.com/package/webpack-merge
  'webpack.extend': {},

  // Enabling sourcemaps in styles when using Hot Module Reloading causes
  // style-loader to inject styles using a <link> tag instead of <style> tag.
  // This causes a FOUC content, which can cause issues with JS that is reading
  // the DOM for styles (width, height, visibility) on page load.
  'webpack.sourceMap.styles': () => {
    return process.env.NODE_ENV === 'production';
  },

  // Array of PostCSS plugins which is passed to the Webpack PostCSS Loader
  'webpack.postcss.plugins': (config) => [
    autoprefixer,

    ...(process.env.NODE_ENV === 'production'
      ? [cssnano(config.get('webpack.cssnano.settings'))]
      : []),
  ],

  // Optimization settings for the cssnano plugin
  'webpack.cssnano.settings': {zindex: false, reduceIdents: false},

  // Object which contains entrypoints used in webpack's config.entry key
  'webpack.entrypoints': {},
};
