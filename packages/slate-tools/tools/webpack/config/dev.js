const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const SlateConfig = require('@shopify/slate-config');

const core = require('./parts/core');
const babel = require('./parts/babel');
const entry = require('./parts/entry');

const commonExcludes = require('./utilities/common-excludes');
const getLayoutEntrypoints = require('./utilities/get-layout-entrypoints');
const getTemplateEntrypoints = require('./utilities/get-template-entrypoints');
const HtmlWebpackIncludeLiquidStylesPlugin = require('../html-webpack-include-chunks');
const config = new SlateConfig(require('../../../slate-tools.schema'));

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
  {
    mode: 'development',

    devtool: '#eval-source-map',

    module: {
      rules: [
        {
          test: /^(?:(?!(css|scss|sass)).)*\.(liquid)$/,
          exclude: commonExcludes(),
          use: [
            {loader: 'extract-loader'},
            {
              loader: '@shopify/slate-liquid-asset-loader',
              options: {devServer: true},
            },
          ],
        },
        {
          test: /\.s[ac]ss$/,
          exclude: commonExcludes(),
          use: [
            {
              loader: 'style-loader',
              options: {
                hmr: true,
              },
            },
            {
              loader: 'css-loader',
              // Enabling sourcemaps in styles causes style-loader to inject
              // styles using a <link> tag instead of <style> tag. This causes
              // a FOUC content, which can cause issues with JS that is reading
              // the DOM for styles (width, height, visibility) on page load.
              options: {importLoaders: 2, sourceMap: false},
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                sourceMap: false,
                plugins: () => [autoprefixer],
              },
            },
            {loader: 'sass-loader', options: {sourceMap: false}},
          ],
        },
      ],
    },

    plugins: [
      new webpack.HotModuleReplacementPlugin(),

      new HtmlWebpackPlugin({
        excludeChunks: ['static'],
        filename: `../snippets/script-tags.liquid`,
        template: path.resolve(__dirname, '../script-tags.html'),
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
        filename: `../snippets/style-tags.liquid`,
        template: path.resolve(__dirname, '../style-tags.html'),
        inject: false,
        minify: {
          removeComments: true,
          removeAttributeQuotes: false,
          // more options:
          // https://github.com/kangax/html-minifier#options-quick-reference
        },
        // necessary to consistently work with multiple chunks via CommonsChunkPlugin
        chunksSortMode: 'dependency',
        liquidTemplates: getTemplateEntrypoints(),
        liquidLayouts: getLayoutEntrypoints(),
      }),

      new HtmlWebpackIncludeLiquidStylesPlugin(),
    ],
  },
  config.get('webpack.config.extend.dev'),
]);
