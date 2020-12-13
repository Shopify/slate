const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const SlateConfig = require('@yourwishes/slate-config');
const SlateSectionsPlugin = require('@yourwishes/slate-sections-plugin');
const config = new SlateConfig(require('../../../../slate-tools.schema'));
const injectLocalesIntoSettingsSchema = require('../utilities/inject-locales-into-settings-schema');

//Directories
const modules = [
  path.join(config.get('paths.theme'), 'node_modules'), //Themes node modules
  path.resolve(__dirname, '..', '..', '..', '..', '..', '..'),//Monorepo root
  path.resolve(__dirname, '..', '..'),//Monorepo / slate-tools/tools/webpack/
  path.resolve(__dirname, '..', '..', '..', '..', '..', '..', 'node_modules'),//Monorepo root / node_modules
  path.resolve(__dirname, '..', '..', '..', '..', 'node_modules'),//Monorepo / Slate tools / node_modules
];

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
    modules
  },

  resolve: {
    modules,
    extensions: [ '.wasm', '.mjs', '.js', '.json', '.jsx', '.ts', '.tsx' ]
  },

  externals: {
    jquery: 'jQuery',
    jQuery: 'jQuery',
    $: 'jQuery'
  },

  module: {
    rules: [
      {
        test: /\.js|\.ts$/,
        exclude: config.get('webpack.commonExcludes'),
        loader: 'hmr-alamo-loader',
      },
      {
        test: /\.(eot|ttf|woff|woff2|otf)$/,
        exclude: /node_modules/,
        use: [
          { loader: 'file-loader', options: { name: '[name].[ext]' } }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        exclude: config.get('webpack.commonExcludes'),
        use: [
          { loader: 'file-loader', options: {name: '[name].[ext]'}},
          { loader: 'img-loader' },
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
        use: extractLiquidStyles.extract(['@yourwishes/concat-style-loader']),
      },
    ],
  },

  plugins: [
    new CopyWebpackPlugin({
      patterns: [
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
          from: config.get('paths.theme.src.templates'),
          to: config.get('paths.theme.dist.templates'),
        }
      ]
    }),

    //Sections
    new SlateSectionsPlugin({
      from: config.get('paths.theme.src.sections'),
      to: config.get('paths.theme.dist.sections'),
    }),

    //Snippets
    new SlateSectionsPlugin({
      from: config.get('paths.theme.src.snippets'),
      to: config.get('paths.theme.dist.snippets'),
    }),
  ]
};
