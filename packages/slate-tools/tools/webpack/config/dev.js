const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const SlateConfig = require('@yourwishes/slate-config');

const core = require('./parts/core');
const babel = require('./parts/babel');
const entry = require('./parts/entry');
const sass = require('./parts/sass');
const css = require('./parts/css');

const getLayoutEntrypoints = require('./utilities/get-layout-entrypoints');
const getTemplateEntrypoints = require('./utilities/get-template-entrypoints');
const HtmlWebpackIncludeLiquidStylesPlugin = require('../html-webpack-include-chunks');
const config = new SlateConfig(require('../../../slate-tools.schema'));

const { getScriptTemplate } = require('./../templates/script-tags-template');
const { getStyleTemplate } = require('./../templates/style-tags-template');

// add hot-reload related code to entry chunks
Object.keys(entry.entry).forEach((name) => {
  entry.entry[name] = [path.join(__dirname, '../hot-client.js')].concat(
    entry.entry[name],
  );
});

module.exports = merge([
  core,
  entry,
  babel,
  sass,
  css,
  {
    mode: 'development',

    devtool: '#eval-source-map',

    plugins: [
      new webpack.HotModuleReplacementPlugin(),

      //Static scripts
      new HtmlWebpackPlugin({
        excludeChunks: ['static'],
        filename: `../snippets/tool.script-tags.liquid`,
        templateContent: (...params) => getScriptTemplate(...params),
        inject: false,
        minify: {
          removeComments: true,
          removeAttributeQuotes: false,
        },
        isDevServer: true,
        liquidTemplates: getTemplateEntrypoints(),
        liquidLayouts: getLayoutEntrypoints(),
      }),

      new HtmlWebpackPlugin({
        excludeChunks: ['static'],
        filename: `../snippets/tool.style-tags.liquid`,
        templateContent: (...params) => getStyleTemplate(...params),
        inject: false,
        minify: {
          removeComments: true,
          removeAttributeQuotes: false,
        },
        isDevServer: true,
        liquidTemplates: getTemplateEntrypoints(),
        liquidLayouts: getLayoutEntrypoints(),
      }),

      new HtmlWebpackIncludeLiquidStylesPlugin(),
    ],
  },
  config.get('webpack.extend'),
]);
