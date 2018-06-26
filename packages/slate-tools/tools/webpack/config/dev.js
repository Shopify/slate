const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const commonExcludes = require('../common-excludes');
const webpackCoreConfig = require('./core');
const userWebpackConfig = require('../get-user-webpack-config')('dev');
const config = require('../../../slate-tools.config');
const {templateFiles, layoutFiles} = require('../entrypoints');
const HtmlWebpackIncludeLiquidStylesPlugin = require('../html-webpack-include-chunks');

// so that everything is absolute
webpackCoreConfig.output.publicPath = `${config.domain}:${config.port}/`;

// add hot-reload related code to entry chunks
Object.keys(webpackCoreConfig.entry).forEach((name) => {
  webpackCoreConfig.entry[name] = [
    path.join(__dirname, '../hot-client.js'),
  ].concat(webpackCoreConfig.entry[name]);
});

module.exports = merge(
  webpackCoreConfig,
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
        liquidTemplates: templateFiles(),
        liquidLayouts: layoutFiles(),
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
        liquidTemplates: templateFiles(),
        liquidLayouts: layoutFiles(),
      }),

      new HtmlWebpackIncludeLiquidStylesPlugin(),
    ],
  },
  userWebpackConfig,
);
