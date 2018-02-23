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
const config = require('../../../config');
const packageJson = require('../../../package.json');

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
    devtool: 'hidden-source-map',

    module: {
      rules: [
        ...eslintLoader(),

        {
          test: /\.s[ac]ss$/,
          exclude: commonExcludes(),
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              { loader: '@shopify/slate-cssvar-loader' },
              {
                loader: 'css-loader',
                options: { importLoaders: 2, sourceMap: true },
              },
              {
                loader: 'postcss-loader',
                options: {
                  ident: 'postcss',
                  sourceMap: true,
                  plugins: [autoprefixer, cssnano],
                },
              },
              { loader: 'sass-loader', options: { sourceMap: true } },
            ],
          }),
        },
      ],
    },

    plugins: [
      ...stylelintLoader(),

      new CleanWebpackPlugin(['dist'], {
        root: config.paths.root,
      }),

      new webpack.DefinePlugin({
        'process.env': { NODE_ENV: '"production"' },
      }),

      new UglifyJSPlugin({
        sourceMap: true,
      }),

      // extract css into its own file
      new ExtractTextPlugin('styles.css.liquid'),

      // generate dist/layout/*.liquid for all layout files with correct paths to assets
      ...fs.readdirSync(config.paths.layouts).map(filename => {
        return new HtmlWebpackPlugin({
          excludeChunks: ['static'],
          filename: `../layout/${filename}`,
          template: `./layout/${filename}`,
          inject: true,
          minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true,
            // more options:
            // https://github.com/kangax/html-minifier#options-quick-reference
          },
          // necessary to consistently work with multiple chunks via CommonsChunkPlugin
          chunksSortMode: 'dependency',
        });
      }),

      new HtmlWebpackIncludeAssetsPlugin({
        assets: ['styles.css'],
        append: true,
      }),

      new SlateLiquidAssetsPlugin(),
      // This Plugin is currently breaking settings_schema.json validation.
      // Commenting out until its fixed.
      // new SlateTagPlugin(packageJson.version),

      // split node_modules/vendors into their own file
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: module =>
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(config.paths.root, 'node_modules'),
          ) === 0,
      }),

      // extract webpack runtime and module manifest to its own file in order to
      // prevent vendor hash from being updated whenever app bundle is updated
      new webpack.optimize.CommonsChunkPlugin({
        name: 'manifest',
        chunks: ['vendor'],
      }),
    ],
  },
  userWebpackConfig,
);
