/* eslint-disable */
const chalk = require('chalk');
const prompt = require('react-dev-utils/prompt');
const https = require('https');
const YAML = require('yamljs');
const config = require('../config');

let mainThemeId;

/**
 * Fetch the main theme ID from Shopify
 *
 * @param   env   String  The environment to check against
 * @return        Promise Reason for abort or the main theme ID
 */
function fetchMainThemeId(env) {
  return new Promise((resolve, reject) => {
    const shopifyConfigFile = YAML.load(config.paths.userShopifyConfig);
    const envConfig = shopifyConfigFile[env];

    https.get(
      {
        hostname: envConfig.store,
        path: '/admin/themes.json',
        auth: `${envConfig.api_key}:${envConfig.password}`,
        agent: false,
      },
      res => {
        let body = '';

        res.on('data', datum => (body += datum));

        res.on('end', () => {
          const parsed = JSON.parse(body);

          if (parsed.errors) {
            reject(JSON.stringify(parsed.errors, null, '\t'));
            return;
          }

          if (!Array.isArray(parsed.themes)) {
            reject(`
            Shopify response for /admin/themes.json is not an array.

            ${JSON.stringify(parsed, null, '\t')}
          `);
            return;
          }

          const mainTheme = parsed.themes.find(t => t.role === 'main');

          if (!mainTheme) {
            reject(`
            No main theme in response.

            ${JSON.stringify(parsed.themes, null, '\t')}
          `);
            return;
          }

          resolve(mainTheme.id);
        });
      }
    );
  });
}

/**
 * Prompt the user to confirm if they are about to deploy to the main theme
 *
 * @param   env   String  The environment to check against
 * @return        Promise Reason for abort or empty resolve
 */
function promptIfMainTheme(env) {
  return new Promise((resolve, reject) => {
    const shopifyConfigFile = YAML.load(config.paths.userShopifyConfig);
    const envConfig = shopifyConfigFile[env];

    if (!envConfig.api_key) {
      console.log(
        chalk.yellow(
          `The "${env}" environment in config/shopify.yml does not specify an "api_key". Skipping check for if is main theme.`
        )
      );
      resolve();
      return;
    }

    // c.theme_id is live or equal to mainThemeId
    if (
      envConfig.theme_id === 'live' ||
      (mainThemeId && mainThemeId === envConfig.theme_id)
    ) {
      const question = 'You are about to deploy to the main theme. Continue ?';

      prompt(question, false).then(isYes => {
        if (isYes) {
          resolve();
          return;
        }

        reject('Aborting. You aborted the deploy.');
      });

      return;
    }

    // we already have a mainThemeId and it's not c.theme_id
    if (mainThemeId && mainThemeId !== envConfig.theme_id) {
      resolve();
      return;
    }

    fetchMainThemeId(env)
      .then(id => {
        mainThemeId = id;
        promptIfMainTheme(env)
          .then(resolve)
          .catch(reject);
      })
      .catch(reject);
  });
}

module.exports = promptIfMainTheme;
