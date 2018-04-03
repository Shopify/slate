const fs = require('fs');
const commonExcludes = require('../common-excludes');
const config = require('../../../slate-tools.config');

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
