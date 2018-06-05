const fs = require('fs');
const webpack = require('webpack');
const WriteFileWebpackPlugin = require('write-file-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const commonExcludes = require('../common-excludes');
const babelLoader = require('../loaders/babel-loader');
const config = require('../../../slate-tools.config');
const {entrypointFiles} = require('../entrypoints');

const paths = config.paths;

const extractLiquidStyles = new ExtractTextPlugin(
  '[name].styleLiquid.scss.liquid',
);

/**
 * Return an array of ContextReplacementPlugin to use.
 * Omit the __appstatic__ replacement if the directory does not exists.
 *
 * @see https://webpack.js.org/plugins/context-replacement-plugin/#newcontentcallback
 */

function replaceCtxRequest(request) {
  return (context) => Object.assign(context, {request});
}

function contextReplacementPlugins() {
  // Given a request path, return a function that accepts a context and modify it's request.

  const plugins = [
    new webpack.ContextReplacementPlugin(
      /__appsrc__/,
      replaceCtxRequest(paths.src),
    ),
  ];

  if (fs.existsSync(paths.static)) {
    plugins.push(
      new webpack.ContextReplacementPlugin(
        /__appstatic__/,
        replaceCtxRequest(paths.static),
      ),
    );
  }

  if (fs.existsSync(paths.images)) {
    plugins.push(
      new webpack.ContextReplacementPlugin(
        /__appimages__/,
        replaceCtxRequest(paths.images),
      ),
    );
  }

  if (fs.existsSync(paths.fonts)) {
    plugins.push(
      new webpack.ContextReplacementPlugin(
        /__appfonts__/,
        replaceCtxRequest(paths.fonts),
      ),
    );
  }

  return plugins;
}

module.exports = {
  context: paths.src,

  entry: Object.assign(entrypointFiles(), config.paths.entrypoints),

  output: {
    filename: '[name].js',
    path: config.paths.assetsOutput,
  },

  resolveLoader: {
    modules: [
      config.paths.nodeModules.self,
      config.paths.nodeModules.repo,
      config.paths.nodeModules.app,
      config.paths.webpack,
    ],
  },

  module: {
    rules: [
      ...babelLoader(),

      {
        test: /\.js$/,
        exclude: commonExcludes(),
        loader: 'hmr-alamo-loader',
      },
      {
        test: /fonts\/.*\.(eot|svg|ttf|woff|woff2)$/,
        exclude: /node_modules/,
        loader: 'file-loader',
      },
      {
        test: config.regex.images,
        exclude: commonExcludes(),
        use: [
          {loader: 'file-loader', options: {name: '[name].[ext]'}},
          {loader: 'img-loader'},
        ],
      },
      {
        test: config.regex.static,
        exclude: commonExcludes('assets/styles'),
        loader: 'file-loader',
        options: {
          name: '../[path][name].[ext]',
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
        exclude: commonExcludes(),
        use: extractLiquidStyles.extract(['concat-style-loader']),
      },
    ],
  },

  plugins: [
    ...contextReplacementPlugins(),

    extractLiquidStyles,

    new CopyWebpackPlugin([
      {
        from: config.paths.svgs,
        to: `${config.paths.snippetsOutput}/[name].liquid`,
      },
    ]),

    new CopyWebpackPlugin([
      {
        from: config.paths.locales.src,
        to: config.paths.locales.dist,
      },
    ]),

    new CopyWebpackPlugin([
      {
        from: config.paths.settings.src,
        to: config.paths.settings.dist,
      },
    ]),

    new WriteFileWebpackPlugin({
      test: /\.(png|jpg|gif|scss|jpeg)/,
      log: false,
    }),

    new WriteFileWebpackPlugin({
      test: /^(?:(?!hot-update.json$).)*\.(liquid|json)$/,
      log: false,
    }),
  ],
};
