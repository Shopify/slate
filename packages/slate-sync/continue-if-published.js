/* eslint-disable */
const chalk = require('chalk');
const inquirer = require('inquirer');
const https = require('https');
const slateEnv = require('@shopify/slate-env');
const {event} = require('@shopify/slate-analytics');
const figures = require('figures');
const {argv} = require('yargs');

const question = {
  type: 'confirm',
  name: 'continueWithDeploy',
  message: 'You are about to deploy to the published theme. Continue?',
  default: true,
  prefix: chalk.yellow(`${figures.warning} `),
};

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
module.exports = async function continueIfPublishedTheme(env) {
  if (argv.skipPrompts) {
    return question.default;
  }

  const publishedThemeId = await fetchMainThemeId();
  const currentThemeId = slateEnv.getThemeIdValue();

  if (
    currentThemeId !== 'live' &&
    currentThemeId !== publishedThemeId.toString()
  ) {
    return question.default;
  }

  console.log();
  const answer = await inquirer.prompt([question]);

  return answer.continueWithDeploy;
};
