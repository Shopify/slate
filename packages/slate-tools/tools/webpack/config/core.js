const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const WriteFileWebpackPlugin = require('write-file-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const commonExcludes = require('@shopify/slate-common-excludes');
const babelLoader = require('@shopify/slate-babel');
const config = require('../../../slate-tools.config');

const paths = config.paths;

const isDevServer = process.argv[3] === 'start';

/**
 * Return an array of ContextReplacementPlugin to use.
 * Omit the __appvendors__ replacement if the directory does not exists.
 *
 * @see https://webpack.js.org/plugins/context-replacement-plugin/#newcontentcallback
 */

function replaceCtxRequest(request) {
  return context => Object.assign(context, {request});
}

function contextReplacementPlugins() {
  // Given a request path, return a function that accepts a context and modify it's request.

  const plugins = [
    new webpack.ContextReplacementPlugin(
      /__appsrc__/,
      replaceCtxRequest(paths.src),
    ),
  ];

  if (fs.existsSync(paths.vendors)) {
    plugins.push(
      new webpack.ContextReplacementPlugin(
        /__appvendors__/,
        replaceCtxRequest(paths.vendors),
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

  entry: config.paths.entrypoints,

  output: {
    filename: '[name].js',
    path: config.paths.assetsOutput,
  },

  resolveLoader: {
    modules: [
      config.paths.nodeModules.app,
      config.paths.nodeModules.self,
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
        // excluding layout/*.liquid files as they are also being emitted by the HtmlWebpackPlugin
        exclude: commonExcludes(
          ...fs
            .readdirSync(config.paths.layouts)
            .map(filename => `layout/${filename}`),
        ),
        loader: 'file-loader',
        options: {
          name: '../[path][name].[ext]',
        },
      },
      {
        test: /assets\/vendors\//,
        exclude: /node_modules/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
        },
      },
      {
        test: /layout\/.*?\.liquid$/,
        exclude: commonExcludes(),
        loader: 'raw-loader',
      },
      {
        test: /\.liquid$/,
        exclude: commonExcludes(),
        loader: `extract-loader!@shopify/slate-liquid-asset-loader?dev-server=${
          isDevServer ? 'true' : 'false'
        }`,
      },
    ],
  },

  plugins: [
    ...contextReplacementPlugins(),

    new CopyWebpackPlugin([
      {
        from: config.paths.svgs,
        to: `${config.paths.snippetsOutput}/[name].liquid`,
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
