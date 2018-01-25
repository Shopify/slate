/* eslint-disable */
const chalk = require('chalk');
const prompt = require('react-dev-utils/prompt');
const https = require('https');
const YAML = require('yamljs');
const slateEnv = require('@shopify/slate-env');
const config = require('../config');

/**
 * Fetch the main theme ID from Shopify
 *
 * @param   env   String  The environment to check against
 * @return        Promise Reason for abort or the main theme ID
 */
function fetchMainThemeId() {
  return new Promise((resolve, reject) => {
    https.get(
      {
        hostname: slateEnv.getStoreValue(),
        path: '/admin/themes.json',
        auth: `:${slateEnv.getPasswordValue}`,
        agent: false,
        headers: {
          'X-Shopify-Access-Token': slateEnv.getPasswordValue(),
        },
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
    fetchMainThemeId()
      .then(id => {
        const themeId = slateEnv.getThemeIdValue();
        // c.theme_id is live or equal to mainThemeId
        if (themeId === 'live' || themeId === id.toString()) {
          const question =
            'You are about to deploy to the main theme. Continue?';

          prompt(question, false).then(isYes => {
            if (isYes) {
              resolve();
              return;
            }

            reject('Aborting. You aborted the deploy.');
          });

          return;
        }
      })
      .catch(reject);
  });
}

module.exports = promptIfMainTheme;
