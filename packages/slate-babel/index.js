const fs = require('fs');
const commonExcludes = require('@shopify/slate-common-excludes');
const config = require('./config');

module.exports = () => {
  if (
    !fs.existsSync(config.babelLoaderConfigPath) ||
    !config.babelLoaderEnable
  ) {
    return [];
  }

  return [
    {
      test: /\.js$/,
      exclude: commonExcludes(),
      loader: 'babel-loader',
      options: {
        babelrc: false,
        extends: config.babelLoaderConfigPath,
      },
    },
  ];
};
