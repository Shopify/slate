/* eslint-disable */
const chalk = require('chalk');
const inquirer = require('inquirer');
const https = require('https');
const slateEnv = require('@shopify/slate-env');
const { event } = require('@shopify/slate-analytics');
const config = require('../config');
const figures = require('figures');

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
function promptIfPublishedTheme(env) {
  return new Promise((resolve, reject) => {
    fetchMainThemeId()
      .then(id => {
        const themeId = slateEnv.getThemeIdValue();
        // c.theme_id is live or equal to mainThemeId
        if (themeId === 'live' || themeId === id.toString()) {
          const question = {
            type: 'confirm',
            name: 'abortMainDeploy',
            message:
              'You are about to deploy to the published theme. Continue?',
            default: false,
            prefix: chalk.yellow(`${figures.warning} `),
          };

          console.log('');
          inquirer.prompt([question]).then(answer => {
            if (answer.abortMainDeploy) {
              event('slate-tools:deploy:main-theme');
              return resolve();
            }

            console.log(
              chalk.red(
                `\n${figures.cross}  Aborting. You aborted the deploy.\n`
              )
            );
            reject();
          });
        } else {
          resolve();
        }
      })
      .catch(reject);
  });
}

module.exports = promptIfPublishedTheme;
