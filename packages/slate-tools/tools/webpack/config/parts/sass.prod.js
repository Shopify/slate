const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const SlateConfig = require('@shopify/slate-config');

const commonExcludes = require('../../common-excludes');
const config = new SlateConfig(require('../../../../slate-tools.schema'));

const extractStyles = new ExtractTextPlugin({
  filename: '[name].css.liquid',
  allChunks: true,
});

module.exports = {
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/,
        exclude: commonExcludes(),
        use: extractStyles.extract({
          fallback: 'style-loader',
          use: [
            {loader: '@shopify/slate-cssvar-loader'},
            {
              loader: 'css-loader',
              options: {importLoaders: 2, sourceMap: true},
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                sourceMap: true,
                plugins: [
                  autoprefixer,
                  cssnano(config.get('webpack.cssnano.settings')),
                ],
              },
            },
            {loader: 'sass-loader', options: {sourceMap: true}},
          ],
        }),
      },
    ],
  },

  plugins: [extractStyles],
};
