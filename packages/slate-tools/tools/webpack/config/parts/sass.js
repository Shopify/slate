const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SlateConfig = require('@yourwishes/slate-config');
const config = new SlateConfig(require('../../../../slate-tools.schema'));

const isDev = process.env.NODE_ENV === 'development';

const part = {
  module: {
    rules: [],
  },
  plugins: [],
};

const sassRule = {
  test: /\.scss$/,
};

const styleLoader = {
  loader: 'style-loader'
};

const cssLoader = {
  loader: 'css-loader',
  options: {
    sourceMap: config.get('webpack.sourceMap.styles'),
    modules: {
      compileType: 'icss',
    }
  },
};

const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    ident: 'postcss',
    sourceMap: config.get('webpack.sourceMap.styles'),
    plugins: config.get('webpack.postcss.plugins'),
  },
};

const sassLoader = {
  loader: 'sass-loader',
  options: {sourceMap: config.get('webpack.sourceMap.styles')},
};

sassRule.use = [
  ...(isDev ? [styleLoader] : [MiniCssExtractPlugin.loader]),
  cssLoader,
  postcssLoader,
  sassLoader,
];

part.module.rules.push(sassRule);

module.exports = part;
