var pkg = require('../../package.json');
var utils = require('./utilities.js');

/**
 * slate-cli configuration object
 * ## Markdown stuff
 *
 * It's a big description written in `markdown`
 *
 * Example:
 *
 * ```javascript
 * $('something')
 *   .something(else);
 * ```
 *
 * @namespace config
 * @memberof slate-cli
 * @summary Configuring slate-cli
 *  @prop {String} storeURL - the url to your store
 *  @prop {String} zipFileName - the filename to use for your zip file (set from package.json) by default
 *  @prop {String} environment - development | staging | production
 *  @prop {Object} paths - paths to various files & directories
 *  @prop {Object} plugins - configuration objects passed to various plugins used in the task interface
 */

/**
 * ## File Paths
 *
 * It's a big description written in `markdown`
 *
 * Example:
 *
 * ```javascript
 * $('something')
 *   .something(else);
 * ```
 *
 * @member {Object} paths
 * @memberof slate-cli.config
 */

/**
 * ## Plugin Configuration
 *
 * It's a big description written in `markdown`
 *
 * Example:
 *
 * ```javascript
 * $('something')
 *   .something(else);
 * ```
 * @member {Object} plugins
 * @memberof slate-cli.config
 */

var config = {
  storeURI: 'https://themes.shopify.com/services/internal/themes/' + pkg.name + '/edit',
  zipFileName: pkg.name + '.zip',
  environment: 'development',
  paths: {
    srcScss: 'src/stylesheets/**/*.*',
    srcJs: 'src/scripts/**/*.*',
    srcIcons: 'src/icons/**/*.svg',
    srcBase: 'src/',
    srcAssets: [
      'src/assets/*.*',
      'src/templates/**/*.*',
      'src/snippets/*.*',
      'src/locales/*.*',
      'src/config/*.*',
      'src/layout/*.*',
      'src/sections/*.*'
    ],
    yamlConfig: 'config.yml',
    parentIncludeScss: [
      'src/stylesheets/[^_]*.*'
    ],
    parentIncludeJs: [
      'src/scripts/[^_]*.*'
    ],
    scss: 'src/stylesheets/**/*.scss',
    images: 'src/images/*.{png,jpg,gif}',
    destAssets: 'dist/assets',
    destSnippets: 'dist/snippets',
    deployLog: 'deploy.log',
    dist: 'dist/'
  },
  plugins: {
    cheerio: {run: utils.processSvg},
    svgmin: {
      plugins: [{removeTitle: true}, {removeDesc: true}]
    }
  }
};
module.exports = config;
