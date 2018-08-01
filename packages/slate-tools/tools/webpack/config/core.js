const fs = require('fs');
const webpack = require('webpack');
const WriteFileWebpackPlugin = require('write-file-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const commonExcludes = require('../common-excludes');
const babelLoader = require('../loaders/babel-loader');
const {paths, regex} = require('../../../slate-tools.config');
const {entrypointFiles} = require('../entrypoints');

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

  if (fs.existsSync(paths.static.src)) {
    plugins.push(
      new webpack.ContextReplacementPlugin(
        /__appstatic__/,
        replaceCtxRequest(paths.static.src),
      ),
    );
  }

  if (fs.existsSync(paths.images.src)) {
    plugins.push(
      new webpack.ContextReplacementPlugin(
        /__appimages__/,
        replaceCtxRequest(paths.images.src),
      ),
    );
  }

  if (fs.existsSync(paths.fonts.src)) {
    plugins.push(
      new webpack.ContextReplacementPlugin(
        /__appfonts__/,
        replaceCtxRequest(paths.fonts.src),
      ),
    );
  }

  return plugins;
}

module.exports = {
  context: paths.src,

  entry: Object.assign(entrypointFiles(), paths.entrypoints),

  output: {
    filename: '[name].js',
    path: paths.assetsOutput,
    jsonpFunction: 'shopifySlateJsonp',
  },

  resolveLoader: {
    modules: [
      paths.nodeModules.self,
      paths.nodeModules.repo,
      paths.nodeModules.app,
      paths.webpack,
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
        test: regex.images,
        exclude: commonExcludes(),
        use: [
          {loader: 'file-loader', options: {name: '[name].[ext]'}},
          {loader: 'img-loader'},
        ],
      },
      {
        test: regex.static,
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

    new CopyWebpackPlugin(
      [
        {
          from: paths.svgs,
          to: `${paths.snippets.dist}/[name].liquid`,
        },
        {
          from: paths.static.src,
          to: paths.static.dist,
        },
        {
          from: paths.images.src,
          to: paths.images.dist,
        },
        {
          from: paths.fonts.src,
          to: paths.fonts.dist,
        },
        {
          from: paths.locales.src,
          to: paths.locales.dist,
        },
        {
          from: paths.settings.src,
          to: paths.settings.dist,
        },
      ].filter((directory) => fs.existsSync(directory.from)),
    ),

    new WriteFileWebpackPlugin({
      test: /^(?:(?!hot-update.json$).)*\.(liquid|json)$/,
      log: false,
    }),
  ],
};
