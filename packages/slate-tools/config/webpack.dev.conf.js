const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const commonExcludes = require('@shopify/slate-common-excludes');
const webpackConfig = require('./webpack.base.conf');
const userWebpackConfig = require('../lib/get-user-webpack-config')('dev');
const config = require('./index');

// so that everything is absolute
webpackConfig.output.publicPath = `${config.domain}:${config.port}/`;

// add hot-reload related code to entry chunks
Object.keys(webpackConfig.entry).forEach(name => {
  webpackConfig.entry[name] = [
    path.join(__dirname, '../lib/hot-client.js'),
  ].concat(webpackConfig.entry[name]);
});

module.exports = merge(
  webpackConfig,
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
              options: {importLoaders: 2, sourceMap: false},
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                sourceMap: true,
                plugins: () => [autoprefixer],
              },
            },
            {loader: 'sass-loader', options: {sourceMap: true}},
          ],
        },
      ],
    },

    plugins: [
      new webpack.DefinePlugin({
        'process.env': {NODE_ENV: '"development"'},
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
