const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const commonExcludes = require('@shopify/slate-common-excludes');
const SlateLiquidAssetsPlugin = require('@shopify/html-webpack-liquid-asset-tags-plugin');
const SlateTagPlugin = require('@shopify/slate-tag-webpack-plugin');
const webpackCoreConfig = require('./core');
const userWebpackConfig = require('../get-user-webpack-config')('prod');
const config = require('../../../slate-tools.config');
const packageJson = require('../../../package.json');
const {templateFiles, layoutFiles} = require('../entrypoints');

function eslintLoader() {
  if (!fs.existsSync(config.paths.eslint.rc)) {
    return [];
  }

  const ignorePath = fs.existsSync(config.paths.eslint.ignore)
    ? config.paths.eslint.ignore
    : null;

  return [
    {
      enforce: 'pre',
      test: /\.js$/,
      exclude: commonExcludes(),
      loader: 'eslint-loader',
      options: {
        ignorePath,
        eslintPath: config.paths.eslint.bin,
        configFile: config.paths.eslint.rc,
        emitWarning: true,
      },
    },
  ];
}

function stylelintLoader() {
  if (!fs.existsSync(config.paths.stylelint.rc)) {
    return [];
  }

  const ignorePath = fs.existsSync(config.paths.stylelint.ignore)
    ? config.paths.stylelint.ignore
    : null;

  return [
    new StyleLintPlugin({
      configFile: config.paths.stylelint.rc,
      emitErrors: true,
      ignorePath,
    }),
  ];
}

module.exports = merge(
  webpackCoreConfig,
  {
    mode: 'production',
    devtool: 'hidden-source-map',

    module: {
      rules: [
        {
          test: /\.s[ac]ss$/,
          exclude: commonExcludes(),
          use: ExtractTextPlugin.extract({
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
                  plugins: [autoprefixer, cssnano],
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

      // extract css into its own file
      new ExtractTextPlugin('styles.css.liquid'),

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
        excludeChunks: ['static'],
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
      }),

      new HtmlWebpackIncludeAssetsPlugin({
        assets: ['styles.css'],
        append: true,
      }),

      new SlateLiquidAssetsPlugin(),

      new SlateTagPlugin(packageJson.version),
    ],

    optimization: {
      splitChunks: {
        chunks: 'initial',
      },
    },
  },
  userWebpackConfig,
);
