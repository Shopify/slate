/* eslint-disable global-require, import/no-dynamic-require */
const fs = require('fs');
const config = require('../config');

/**
 * Find and return the user webpack config or an empty object if none is found.
 *
 * @param   env   String  The environment
 * @return        Object
 */
module.exports = env => {
  if (!['dev', 'prod'].includes(env)) {
    return {};
  }

  const configPath = `${config.paths.root}/config/webpack.${env}.conf.js`;
  if (fs.existsSync(configPath)) {
    return require(configPath);
  }

  return {};
};
