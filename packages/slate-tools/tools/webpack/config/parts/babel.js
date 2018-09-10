const fs = require('fs');
const SlateConfig = require('@shopify/slate-config');

const commonExcludes = require('../../common-excludes');
const config = new SlateConfig(require('../../../../slate-tools.schema'));

module.exports = () => {
  if (
    !fs.existsSync(config.get('webpack.babel.configPath')) ||
    !config.get('webpack.babel.enable')
  ) {
    return {};
  }

  return {
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: commonExcludes(),
          loader: 'babel-loader',
          options: {
            babelrc: false,
            extends: config.get('webpack.babel.configPath'),
          },
        },
      ],
    },
  };
};
