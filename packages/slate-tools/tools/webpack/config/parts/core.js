const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const SlateConfig = require('@shopify/slate-config');
const config = new SlateConfig(require('../../../../slate-tools.schema'));

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
          new RegExp('assets/styles'),
          new RegExp('sections'),
          new RegExp('snippets'),
          ...config.get('webpack.commonExcludes'),
        ],
        loader: 'file-loader',
        options: {
          name: '../[path][name].[ext]',
        },
      },
      {
        test: /snippets\/.*\.liquid$/,
        loader: 'file-loader',
        options: {
          name: `../snippets/[name].[ext]`,
        },
      },
      {
        test: /sections\/.*\.liquid$/,
        loader: 'file-loader',
        options: {
          name: `../sections/[name].[ext]`,
        },
      },
      {
        test: /assets\/static\//,
        exclude: /node_modules/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
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
        from: config.get('paths.theme.src.sections'),
        to: config.get('paths.theme.dist.sections'),
      },
      {
        from: config.get('paths.theme.src.snippets'),
        to: config.get('paths.theme.dist.snippets'),
      },
      {
        from: config.get('paths.theme.src.templates'),
        to: config.get('paths.theme.dist.templates'),
      },
    ]),
  ],
};
