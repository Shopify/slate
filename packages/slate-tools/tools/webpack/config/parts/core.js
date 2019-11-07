const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const SlateConfig = require('@shopify/slate-config');
const SlateSectionsPlugin = require('@shopify/slate-sections-plugin');
const config = new SlateConfig(require('../../../../slate-tools.schema'));
const injectLocalesIntoSettingsSchema = require('../utilities/inject-locales-into-settings-schema');

const extractLiquidStyles = new ExtractTextPlugin(
  '[name].styleLiquid.scss.liquid',
);

module.exports = {
  context: config.get('paths.theme.src'),

  output: {
    filename: '[name].js',
    path: config.get('paths.theme.dist.assets'),
    jsonpFunction: 'shopifySlateJsonp',
  },

  resolveLoader: {
    modules: [
      path.resolve(__dirname, '../../../../node_modules'),
      path.resolve(__dirname, '../../../../../../node_modules'),
      path.resolve(__dirname, '../../'),
      path.join(config.get('paths.theme'), 'node_modules'),
    ],
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: config.get('webpack.commonExcludes'),
        loader: 'hmr-alamo-loader',
      },
      {
        test: /fonts\/.*\.(eot|svg|ttf|woff|woff2|otf)$/,
        exclude: /node_modules/,
        loader: 'file-loader',
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        exclude: config.get('webpack.commonExcludes'),
        use: [
          {loader: 'file-loader', options: {name: '[name].[ext]'}},
          {loader: 'img-loader'},
        ],
      },
      {
        test: /\.(liquid|json)$/,
        exclude: [
          /(css|scss|sass)\.liquid$/,
          ...config.get('webpack.commonExcludes'),
        ],
        loader: 'file-loader',
        options: {
          name: '../[path][name].[ext]',
        },
      },
      {
        test: /(css|scss|sass)\.liquid$/,
        exclude: config.get('webpack.commonExcludes'),
        use: extractLiquidStyles.extract(['concat-style-loader']),
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin(['dist'], {
      root: config.get('paths.theme'),
    }),

    extractLiquidStyles,

    new CopyWebpackPlugin([
      {
        from: config.get('paths.theme.src.assets'),
        to: config.get('paths.theme.dist.assets'),
        flatten: true,
      },
      {
        from: config.get('paths.theme.src.config'),
        to: config.get('paths.theme.dist.config'),
        ignore: ['locales/*.json'],
        transform(content, filePath) {
          return injectLocalesIntoSettingsSchema(content, filePath);
        },
      },
      {
        from: config.get('paths.theme.src.layout'),
        to: config.get('paths.theme.dist.layout'),
      },
      {
        from: config.get('paths.theme.src.locales'),
        to: config.get('paths.theme.dist.locales'),
      },
      {
        from: config.get('paths.theme.src.snippets'),
        to: config.get('paths.theme.dist.snippets'),
      },
      {
        from: config.get('paths.theme.src.templates'),
        to: config.get('paths.theme.dist.templates'),
      },
      {
        from: config.get('paths.theme.src.pages'),
        to: config.get('paths.theme.dist.pages'),
      },
      {
        from: config.get('paths.theme.src.content'),
        to: config.get('paths.theme.dist.content'),
      },
      {
        from: config.get('paths.theme.src.frame'),
        to: config.get('paths.theme.dist.frame'),
      },
    ]),

    new SlateSectionsPlugin({
      from: config.get('paths.theme.src.sections'),
      to: config.get('paths.theme.dist.sections'),
    }),
  ],
};
