const fs = require('fs');
const SlateConfig = require('@shopify/slate-config');

const config = new SlateConfig(require('../../../../slate-tools.schema'));

const part = {module: {rules: []}};

const babelLoader = {
  test: /\.js$/,
  exclude: config.get('webpack.babel.exclude'),
  loader: 'babel-loader',
  options: {
    babelrc: false,
    extends: config.get('webpack.babel.configPath'),
  },
};

if (
  fs.existsSync(config.get('webpack.babel.configPath')) &&
  config.get('webpack.babel.enable')
) {
  part.module.rules.push(babelLoader);
}

module.exports = part;
