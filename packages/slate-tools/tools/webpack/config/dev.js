const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const commonExcludes = require('@shopify/slate-common-excludes');
const webpackCoreConfig = require('./core');
const userWebpackConfig = require('../get-user-webpack-config')('dev');
const config = require('../../../config');

// so that everything is absolute
webpackCoreConfig.output.publicPath = `${config.domain}:${config.port}/`;

// add hot-reload related code to entry chunks
Object.keys(webpackCoreConfig.entry).forEach(name => {
  webpackCoreConfig.entry[name] = [
    path.join(__dirname, '../hot-client.js'),
  ].concat(webpackCoreConfig.entry[name]);
});

module.exports = merge(
  webpackCoreConfig,
  {
    devtool: '#eval-source-map',

    module: {
      rules: [
        {
          test: /\.s[ac]ss$/,
          exclude: commonExcludes(),
          use: [
            {
              loader: 'style-loader',
              options: {
                hmr: true,
              },
            },
            {
              loader: 'css-loader',
              // Enabling sourcemaps in styles causes style-loader to inject
              // styles using a <link> tag instead of <style> tag. This causes
              // a FOUC content, which can cause issues with JS that is reading
              // the DOM for styles (width, height, visibility) on page load.
              options: { importLoaders: 2, sourceMap: false },
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                sourceMap: false,
                plugins: () => [autoprefixer],
              },
            },
            { loader: 'sass-loader', options: { sourceMap: false } },
          ],
        },
      ],
    },

    plugins: [
      new webpack.DefinePlugin({
        'process.env': { NODE_ENV: '"development"' },
      }),

      new webpack.HotModuleReplacementPlugin(),

      new webpack.NoEmitOnErrorsPlugin(),

      ...fs.readdirSync(config.paths.layouts).map(filename => {
        return new HtmlWebpackPlugin({
          excludeChunks: ['static'],
          filename: `../layout/${filename}`,
          template: `./layout/${filename}`,
          inject: true,
        });
      }),
    ],
  },
  userWebpackConfig,
);
