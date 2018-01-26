const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const WriteFileWebpackPlugin = require('write-file-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const commonExcludes = require('@shopify/slate-common-excludes');
const babelLoader = require('@shopify/slate-babel');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const config = require('../config');
const paths = require('../config/paths');

const isDevServer = process.argv.find(command => command.includes('start'));

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
    return [
      ...plugins,
      new webpack.ContextReplacementPlugin(
        /__appvendors__/,
        replaceCtxRequest(paths.vendors),
      ),
    ];
  }

  return plugins;
}

// add eslint-loader if .eslintrc is present
function lintingLoaders() {
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
      emitErrors: !isDevServer,
      ignorePath,
      lintDirtyModulesOnly: isDevServer,
    }),
  ];
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
      config.paths.lib,
    ],
  },

  module: {
    rules: [
      ...lintingLoaders(),
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
    ...stylelintLoader(),

    new CopyWebpackPlugin([
      {
        from: config.paths.svgs,
        to: `${config.paths.snippetsOutput}/[name].liquid`,
      },
    ]),

    new WriteFileWebpackPlugin({
      test: /\.(png|svg|jpg|gif|scss)/,
      useHashIndex: true,
      log: false,
    }),

    new WriteFileWebpackPlugin({
      test: /^(?:(?!hot-update.json$).)*\.(liquid|json)$/,
      useHashIndex: true,
      log: false,
    }),
  ],
};
