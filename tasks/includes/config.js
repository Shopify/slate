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
 *  @prop {String} environment - development | staging | production
 *  @prop {String} tkconfig - path to themekit config file
 *  @prop {String} scssLintConfig - path to scss-lint config file
 *  @prop {String} deployLog - path to deploy log file
 *  @prop {String} src - globs (multi-filename matching patterns) for various source files
 *  @prop {Object} dist - paths to relevant folder locations in the distributable directory
 *  @prop {Object} roots - array of "root" (entry point) JS & CSS files
 *  @prop {Object} plugins - configuration objects passed to various plugins used in the task interface
 */
var config = {
  environment: 'development',

  tasks: 'tasks/**/*.js',
  tkConfig: 'config.yml',
  scssLintConfig: '.scss-lint.yml',
  deployLog: 'deploy.log',

  src: {
    root: 'src/',
    js: 'src/scripts/**/*.js',
    css: 'src/styles/**/*.scss',
    vendorCss: 'src/styles/vendor/*.scss',
    assets: 'src/assets/**/*',
    icons: 'src/icons/**/*.svg',
    templates: 'src/templates/**/*',
    snippets: 'src/snippets/*',
    locales: 'src/locales/*',
    config: 'src/config/*',
    layout: 'src/layout/*'
  },

  dist: {
    root: 'dist/',
    assets: 'dist/assets/',
    snippets: 'dist/snippets/',
    layout: 'dist/layout/',
    templates: 'dist/templates/',
    locales: 'dist/locales/'
  },

  roots: {
    js: [
      'src/scripts/theme.js'
    ],
    css: [
      'src/styles/theme.scss'
    ]
  },

  plugins: {
    cheerio: {
      run: require('./utilities.js').processSvg
    },
    svgmin: {
      plugins: [{removeTitle: true}, {removeDesc: true}]
    }
  }
};
module.exports = config;

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
 * @member {Object}
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
