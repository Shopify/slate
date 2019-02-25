const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const SlateConfig = require('@shopify/slate-config');
const SlateTagPlugin = require('@shopify/slate-tag-webpack-plugin');
const SlateLocalesPlugin = require('slate-locales-plugin');

const babel = require('./parts/babel');
const sass = require('./parts/sass');
const entry = require('./parts/entry');
const core = require('./parts/core');
const css = require('./parts/css');

const packageJson = require('../../../package.json');
const getChunkName = require('../get-chunk-name');
const getLayoutEntrypoints = require('./utilities/get-layout-entrypoints');
const getTemplateEntrypoints = require('./utilities/get-template-entrypoints');
const HtmlWebpackIncludeLiquidStylesPlugin = require('../html-webpack-include-chunks');
const config = new SlateConfig(require('../../../slate-tools.schema'));

module.exports = merge([
  core,
  entry,
  babel,
  sass,
  css,
  {
    mode: 'production',
    devtool: 'hidden-source-map',

    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css.liquid',
      }),

      new webpack.DefinePlugin({
        'process.env': {NODE_ENV: '"production"'},
      }),

      new UglifyJSPlugin({
        sourceMap: true,
      }),

      // generate dist/layout/*.liquid for all layout files with correct paths to assets

      new HtmlWebpackPlugin({
        excludeChunks: ['static'],
        filename: `../snippets/script-tags.liquid`,
        template: path.resolve(__dirname, '../script-tags.html'),
        inject: false,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: false,
          preserveLineBreaks: true,
          // more options:
          // https://github.com/kangax/html-minifier#options-quick-reference
        },
        // necessary to consistently work with multiple chunks via CommonsChunkPlugin
        chunksSortMode: 'dependency',
        liquidTemplates: getTemplateEntrypoints(),
        liquidLayouts: getLayoutEntrypoints(),
      }),

      new HtmlWebpackPlugin({
        filename: `../snippets/style-tags.liquid`,
        template: path.resolve(__dirname, '../style-tags.html'),
        inject: false,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: false,
          preserveLineBreaks: true,
          // more options:
          // https://github.com/kangax/html-minifier#options-quick-reference
        },
        // necessary to consistently work with multiple chunks via CommonsChunkPlugin
        chunksSortMode: 'dependency',
        liquidTemplates: getTemplateEntrypoints(),
        liquidLayouts: getLayoutEntrypoints(),
      }),

      new HtmlWebpackIncludeLiquidStylesPlugin(),

      new SlateTagPlugin(packageJson.version),
      new SlateLocalesPlugin({
        from: config.get('paths.theme.src.sections'),
        to: config.get('paths.theme.dist.sections'),
        genericTemplateName: 'template.liquid',
      }),
    ],

    optimization: {
      splitChunks: {
        chunks: 'initial',
        name: getChunkName,
      },
    },
  },
  config.get('webpack.extend'),
]);
