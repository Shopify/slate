const url = require('url');
const https = require('https');
const inquirer = require('inquirer');

const questions = [
  {
    type: 'confirm',
    name: 'useDefaultEnv',
    message: 'Would you like to create a default environment file?',
    default: true
  },
  {
    type: 'input',
    name: 'customEnv',
    message: 'What would you like to name your environment file?',
    when: (answers) => !answers.useDefaultEnv
  },
  {
    type: 'input',
    name: 'myshopifyUrl',
    message: 'What is the myshopify.com URL of the Shopify store you wish to connect to?',
    default: '', // TODO: Placeholder instead of default?
    filter: (input) => {
      const u = url.parse(input);
      return u.hostname;
    },
    validate: (input) => {
      // TODO: Ping a service to validate URL
      return true;
    }
  },
  {
    type: 'password',
    name: 'apiPassword',
    message: 'What is the API Password of the Private App on the specified store?',
    default: '', // TODO: Placeholder instead of default?
    validate: async (input, answers) => {
      try {
        await fetchAllThemes(answers.myshopifyUrl, input);
        return true;
      } catch (err) {
        return "Your password is incorrect!";
      }
    }
  },
  {
    type: 'list',
    name: 'themeId',
    message: 'Which Theme would the user like to deploy too?',
    choices: async (answers) => {
      var themes = await fetchAllThemes(answers.myshopifyUrl, answers.apiPassword);
      const options = themes.map((theme) => ({ name: theme.name, value: theme.id }));
      return options;
    }
  },
  {
    type: 'input',
    name: 'ignoredFiles',
    message: 'What files (if any) would you like to ignore deploying?'
  }
]

async function ask() {
  const answer = await inquirer.prompt(questions);

  console.log(answer);
}

ask();

// TODO: Dedupe
function fetchAllThemes(url, password) {
  return new Promise((resolve, reject) => {
    var req = https.get(
      {
        hostname: url,
        path: '/admin/themes.json',
        agent: false,
        headers: {
          'X-Shopify-Access-Token': password,
        },
      },
      res => {
        let body = '';

        res.on('data', datum => (body += datum));

        res.on('error', reject);

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

          resolve(parsed.themes);
        });
      }
    );

    req.on('error', reject);
  });
}
