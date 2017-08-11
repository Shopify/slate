const join = require('path').join;
const logger = require('debug')('slate-tools');
const findRoot = require('find-root');
const gutil = require('gulp-util');

const themeRoot = findRoot(process.cwd());

let pkg = {};

try {
  pkg = require(join(themeRoot, 'package.json'));
} catch (err) {
  logger(err);
}

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
const config = {
  environment: gutil.env.environments || 'development',
  themeRoot,
  packageJson: pkg,

  tkConfig: 'config.yml',
  deployLog: 'deploy.log',

  src: {
    root: 'src/',
    js: 'src/scripts/**/*.{js,js.liquid}',
    vendorJs: 'src/scripts/vendor/*.js',
    json: 'src/**/*.json',
    css: 'src/styles/**/*.{css,scss,scss.liquid}',
    cssLint: 'src/styles/**/*.{css,scss}',
    vendorCss: 'src/styles/vendor/*.{css,scss}',
    assets: 'src/assets/**/*',
    icons: 'src/icons/**/*.svg',
    templates: 'src/templates/**/*',
    snippets: 'src/snippets/*',
    sections: 'src/sections/*',
    locales: 'src/locales/*',
    config: 'src/config/*',
    layout: 'src/layout/*',
  },

  dist: {
    root: 'dist/',
    assets: 'dist/assets/',
    snippets: 'dist/snippets/',
    sections: 'dist/sections/',
    layout: 'dist/layout/',
    templates: 'dist/templates/',
    locales: 'dist/locales/',
  },

  roots: {
    js: 'src/scripts/*.{js,js.liquid}',
    vendorJs: 'src/scripts/vendor.js',
    css: 'src/styles/*.{css,scss}',
  },

  plugins: {
    cheerio: {
      run: require('./utilities.js').processSvg,
    },
    svgmin: {
      plugins: [{removeTitle: true}, {removeDesc: true}],
    },
  },
};

module.exports = config;
