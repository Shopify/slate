const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SlateConfig = require('@process-creative/slate-config');
const config = new SlateConfig(require('../../../../slate-tools.schema'));

const isDev = process.env.NODE_ENV === 'development';

const part = {
  module: {
    rules: [],
  },
  plugins: [],
};

const sassRule = {
  test: /\.s[ac]ss$/,
};

const styleLoader = {
  loader: 'style-loader',
  options: {
    hmr: isDev,
  },
};

const cssLoader = {
  loader: 'css-loader',
  options: {
    importLoaders: 2,
    sourceMap: config.get('webpack.sourceMap.styles'),
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

const cssVarLoader = {loader: '@process-creative/slate-cssvar-loader'};

const sassLoader = {
  loader: 'sass-loader',
  options: {sourceMap: config.get('webpack.sourceMap.styles')},
};

sassRule.use = [
  ...(isDev ? [styleLoader] : [MiniCssExtractPlugin.loader, cssVarLoader]),
  cssLoader,
  postcssLoader,
  sassLoader,
];

part.module.rules.push(sassRule);

module.exports = part;
