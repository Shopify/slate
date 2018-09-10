const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const SlateConfig = require('@shopify/slate-config');
const SlateLiquidAssetsPlugin = require('@shopify/html-webpack-liquid-asset-tags-plugin');
const SlateTagPlugin = require('@shopify/slate-tag-webpack-plugin');

const babel = require('./parts/babel');
const sass = require('./parts/sass.prod');
const commonExcludes = require('./utilities/common-excludes');
const webpackCoreConfig = require('./core');
const packageJson = require('../../../package.json');
const getChunkName = require('../get-chunk-name');
const {templateFiles, layoutFiles} = require('../entrypoints');
const HtmlWebpackIncludeLiquidStylesPlugin = require('../html-webpack-include-chunks');
const config = new SlateConfig(require('../../../slate-tools.schema'));

module.exports = merge(
  webpackCoreConfig,
  babel,
  sass,
  {
    mode: 'production',
    devtool: 'hidden-source-map',

    module: {
      rules: [
        {
          test: /^(?:(?!(css|scss|sass|js)).)*\.(liquid)$/,
          exclude: commonExcludes(),
          use: [
            {loader: 'extract-loader'},
            {
              loader: '@shopify/slate-liquid-asset-loader',
              options: {devServer: false},
            },
          ],
        },
      ],
    },

    plugins: [
      new CleanWebpackPlugin(['dist'], {
        root: config.get('paths.theme'),
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
        liquidTemplates: templateFiles(),
        liquidLayouts: layoutFiles(),
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
        liquidTemplates: templateFiles(),
        liquidLayouts: layoutFiles(),
      }),

      new HtmlWebpackIncludeLiquidStylesPlugin(),

      new SlateLiquidAssetsPlugin(),

      new SlateTagPlugin(packageJson.version),
    ],

    optimization: {
      splitChunks: {
        chunks: 'initial',
        name: getChunkName,
      },
    },
  },
  config.get('webpack.config.extend.prod'),
);
