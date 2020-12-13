const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin  = require('terser-webpack-plugin');
const SlateConfig = require('@yourwishes/slate-config');
const SlateTagPlugin = require('@yourwishes/slate-tag-webpack-plugin');

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

const { getScriptTemplate } = require('./../templates/script-tags-template');
const { getStyleTemplate } = require('./../templates/style-tags-template');

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
        filename: '[name].css',
      }),

      new webpack.DefinePlugin({
        'process.env': {NODE_ENV: '"production"'},
      }),
      
      new HtmlWebpackPlugin({
        excludeChunks: ['static'],
        filename: `../snippets/tool.script-tags.liquid`,
        templateContent: (...params) => getScriptTemplate(...params),
        inject: false,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: false,
          preserveLineBreaks: true,
        },
        liquidTemplates: getTemplateEntrypoints(),
        liquidLayouts: getLayoutEntrypoints(),
      }),

      new HtmlWebpackPlugin({
        filename: `../snippets/tool.style-tags.liquid`,
        templateContent: (...params) => getStyleTemplate(...params),
        inject: false,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: false,
          preserveLineBreaks: true,
        },
        liquidTemplates: getTemplateEntrypoints(),
        liquidLayouts: getLayoutEntrypoints(),
      }),

      new HtmlWebpackIncludeLiquidStylesPlugin(),

      new SlateTagPlugin(packageJson.version),
    ],

    optimization: {
      splitChunks: {
        name: getChunkName
      },
      minimize: true,
      minimizer: [
        new TerserPlugin({
          sourceMap: true
        })
      ],
    },
  },
  config.get('webpack.extend'),
]);
