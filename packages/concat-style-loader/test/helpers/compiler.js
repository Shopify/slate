const path = require('path');
const webpack = require('webpack');
const MemoryFileSystem = require('memory-fs');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = (fixture) => {
  const compiler = webpack({
    context: __dirname,
    entry: fixture,
    output: {
      path: path.resolve(__dirname),
      filename: 'bundle.js',
    },
    module: {
      rules: [
        {
          test: /.*\.(css|scss|sass)$/,
          use: ExtractTextPlugin.extract({
            use: {
              loader: path.resolve(__dirname, '../../index.js'),
            },
          }),
        },
      ],
    },
    plugins: [new ExtractTextPlugin('styles.css')],
  });

  compiler.outputFileSystem = new MemoryFileSystem();

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) reject(err);

      resolve(stats);
    });
  });
};
