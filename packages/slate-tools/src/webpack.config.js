import path from "path";
import config from './config.js';
import webpack from 'webpack';

import CleanWebpackPlugin from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const extractSass = new ExtractTextPlugin({
  filename: "theme.css"
});

module.exports = {
  entry: {
    theme: [
      path.resolve(config.themeRoot, "src/scripts/theme.js"),
      path.resolve(config.themeRoot, "src/styles/theme.scss")
    ]
  },

  module: {
    rules: [
      {
        test: /\.scss$/,
        use: extractSass.extract({
          use: [{
            loader: "css-loader" // translates CSS into CommonJS
          }, {
              loader: "sass-loader" // compiles Sass to CSS
          }]
        })
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: path.resolve(config.themeRoot, './node_modules/@shopify/slate-tools/node_modules/babel-preset-env')
          }
        }
      },
    ]
  },

  resolve: {
    alias: {
      'jquery': path.resolve('./node_modules/jquery'),
      'lodash-es': path.resolve('./node_modules/lodash-es'),
    },
  },

  resolveLoader: {
    modules: [
      "./node_modules/@shopify/slate-tools/node_modules"
    ],
  },

  plugins: [
    new CleanWebpackPlugin('dist', {root: config.themeRoot,}),

    new CopyWebpackPlugin([
      { from: 'src/assets', to: '../assets' },
      { from: 'src/config', to: '../config' },
      { from: 'src/layout', to: '../layout' },
      { from: 'src/locales', to: '../locales' },
      { from: 'src/sections', to: '../sections' },
      { from: 'src/snippets', to: '../snippets' },
      { from: 'src/templates', to: '../templates' }
    ]),

    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      minChunks: function (module) {
        // This prevents stylesheet resources with the .css or .scss extension
        // from being moved from their original chunk to the vendor chunk
        if(module.resource && (/^.*\.(css|scss)$/).test(module.resource)) {
          return false;
        }
        return module.context && module.context.indexOf("node_modules") !== -1;
      }
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: "manifest",
      minChunks: Infinity
    }),

    extractSass
  ],

  output: {
    filename: '[name].js',
    path: path.resolve(config.themeRoot, "dist/assets")
  },
}
