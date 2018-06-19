const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const SlateLiquidAssetsPlugin = require('@shopify/html-webpack-liquid-asset-tags-plugin');
const SlateTagPlugin = require('@shopify/slate-tag-webpack-plugin');
const commonExcludes = require('../common-excludes');
const webpackCoreConfig = require('./core');
const userWebpackConfig = require('../get-user-webpack-config')('prod');
const config = require('../../../slate-tools.config');
const packageJson = require('../../../package.json');
const getChunkName = require('../get-chunk-name');
const {templateFiles, layoutFiles} = require('../entrypoints');
const HtmlWebpackIncludeLiquidStylesPlugin = require('../html-webpack-include-chunks');

const extractStyles = new ExtractTextPlugin({
  filename: '[name].css.liquid',
  allChunks: true,
});

module.exports = merge(
  webpackCoreConfig,
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
        {
          test: /\.s[ac]ss$/,
          exclude: commonExcludes(),
          use: extractStyles.extract({
            fallback: 'style-loader',
            use: [
              {loader: '@shopify/slate-cssvar-loader'},
              {
                loader: 'css-loader',
                options: {importLoaders: 2, sourceMap: true},
              },
              {
                loader: 'postcss-loader',
                options: {
                  ident: 'postcss',
                  sourceMap: true,
                  plugins: [autoprefixer, cssnano(config.cssnanoSettings)],
                },
              },
              {loader: 'sass-loader', options: {sourceMap: true}},
            ],
          }),
        },
      ],
    },

    plugins: [
      new CleanWebpackPlugin(['dist'], {
        root: config.paths.root,
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

      extractStyles,
    ],

    optimization: {
      splitChunks: {
        chunks: 'initial',
        name: getChunkName,
      },
    },
  },
  userWebpackConfig,
);
