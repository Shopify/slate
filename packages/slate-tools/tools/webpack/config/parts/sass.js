const ExtractTextPlugin = require('extract-text-webpack-plugin');
const SlateConfig = require('@shopify/slate-config');
const config = new SlateConfig(require('../../../../slate-tools.schema'));

const isDevelopment = process.env.NODE_ENV === 'development';

const part = {
  module: {
    rules: [],
  },
  plugins: [],
};

const sassRule = {
  test: /\.s[ac]ss$/,
  exclude: config.get('webpack.commonExcludes'),
};

const styleLoader = {
  loader: 'style-loader',
  options: {
    hmr: isDevelopment,
  },
};

const cssLoader = {
  loader: 'css-loader',
  // Enabling sourcemaps in styles when using HMR causes style-loader to inject
  // styles using a <link> tag instead of <style> tag. This causes
  // a FOUC content, which can cause issues with JS that is reading
  // the DOM for styles (width, height, visibility) on page load.
  options: {importLoaders: 2, sourceMap: !isDevelopment},
};

const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    ident: 'postcss',
    sourceMap: !isDevelopment,
    plugins: config.get('webpack.postcss.plugins'),
  },
};

const cssVarLoader = {loader: '@shopify/slate-cssvar-loader'};

const sassLoader = {loader: 'sass-loader', options: {sourceMap: false}};

const extractStyles = new ExtractTextPlugin({
  filename: '[name].css.liquid',
  allChunks: true,
});

if (isDevelopment) {
  sassRule.use = [styleLoader, cssLoader, postcssLoader, sassLoader];
  part.module.rules.push(sassRule);
} else {
  sassRule.use = extractStyles.extract({
    fallback: styleLoader,
    use: [cssVarLoader, cssLoader, postcssLoader, sassLoader],
  });
  part.module.rules.push(sassRule);
  part.plugins.push(extractStyles);
}

module.exports = part;
