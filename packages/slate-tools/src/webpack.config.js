import path from "path";
import config from './config.js';

import CleanWebpackPlugin from 'clean-webpack-plugin';

console.log(config.themeRoot);

module.exports = {
  entry: path.resolve(config.themeRoot, "src/scripts/theme.js"),
  plugins: [
    new CleanWebpackPlugin('dist', {root: config.themeRoot,})
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(config.themeRoot, "dist/assets")
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: path.resolve(config.themeRoot, './node_modules/@shopify/slate-tools/node_modules/babel-preset-env')
          }
        }
      }
    ]
  },
  resolveLoader: {
    modules: [
      "./node_modules/@shopify/slate-tools/node_modules"
    ],
  }
}

console.log(path.resolve(config.themeRoot, "node_modules/@shopify/slate-tools/node_modules"));
