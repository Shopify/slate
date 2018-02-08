/* eslint-disable global-require, import/no-dynamic-require */
const {getSlateConfig} = require('@shopify/slate-config');

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

  const config = getSlateConfig();

  if (config.extends && config.extends[env]) {
    return config.extends[env];
  }

  return {};
};
