const chalk = require('chalk');
const figures = require('figures');
const https = require('https');
const themekit = require('@shopify/themekit').command;
const slateEnv = require('@shopify/slate-env');
const SlateConfig = require('@shopify/slate-config');

const config = new SlateConfig(require('./slate-sync.schema'));

let deploying = false;
let filesToDeploy = [];

function maybeDeploy() {
  if (deploying) {
    return Promise.reject(new Error('Deploy already in progress.'));
  }

  if (filesToDeploy.length) {
    const files = [...filesToDeploy];
    filesToDeploy = [];
    return deploy('deploy', false, files);
  }

  return Promise.resolve();
}

function _validateEnvValues() {
  const result = slateEnv.validate();

  if (!result.isValid) {
    console.log(
      chalk.red(
        `Some values in environment '${slateEnv.getEnvNameValue()}' are invalid:`,
      ),
    );
    result.errors.forEach((error) => {
      console.log(chalk.red(`- ${error}`));
    });

    process.exit(1);
  }
}

function _generateConfigFlags() {
  _validateEnvValues();

  const flags = {
    password: slateEnv.getPasswordValue(),
    themeId: slateEnv.getThemeIdValue(),
    store: slateEnv.getStoreValue(),
    env: slateEnv.getEnvNameValue(),
  };
  if (slateEnv.getTimeoutValue()) {
    flags.timeout = slateEnv.getTimeoutValue();
  }

  // Convert object to key value pairs and flatten the array
  return flags;
}

function _generateIgnoreFlags() {
  const ignoreFiles = slateEnv.getIgnoreFilesValue().split(':');
  const flags = [];

  ignoreFiles.forEach((pattern) => {
    if (pattern.length > 0) {
      flags.push(pattern);
    }
  });

  return flags;
}

/**
 * Deploy to Shopify using themekit.
 *
 * @param   cmd     String    The command to run
 * @param   files   Array     An array of files to deploy
 * @return          Promise
 */
async function deploy(cmd = '', replace = false, files = []) {
  if (!cmd === 'deploy') {
    throw new Error(`shopify-deploy.deploy() first argument must be "deploy"`);
  }

  deploying = true;

  console.log(chalk.magenta(`\n${figures.arrowUp}  Uploading to Shopify...\n`));

  try {
    await promiseThemekitConfig();
    await promiseThemekitDeploy(cmd, replace, files);
  } catch (error) {
    console.error('My Error', error);
  }

  deploying = false;

  return maybeDeploy;
}

async function promiseThemekitConfig() {
  const configure = await themekit(
    'configure',
    {
      ..._generateConfigFlags(),
      ignoredFiles: _generateIgnoreFlags(),
    },
    {
      cwd: config.get('paths.theme.dist'),
    },
  );
  return configure;
}

async function promiseThemekitDeploy(cmd, replace, files) {
  const deployment = await themekit(
    cmd,
    {
      noUpdateNotifier: true,
      ..._generateConfigFlags(),
      files: [...files],
      noDelete: !replace,
    },
    {
      cwd: config.get('paths.theme.dist'),
    },
  );
  return deployment;
}

/**
 * Fetch the main theme ID from Shopify
 *
 * @param   env   String  The environment to check against
 * @return        Promise Reason for abort or the main theme ID
 */
function fetchMainThemeId() {
  _validateEnvValues();

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
      (res) => {
        let body = '';

        res.on('data', (datum) => (body += datum));

        res.on('end', () => {
          const parsed = JSON.parse(body);

          if (parsed.errors) {
            reject(
              new Error(
                `API request to fetch main theme ID failed: \n${JSON.stringify(
                  parsed.errors,
                  null,
                  '\t',
                )}`,
              ),
            );
            return;
          }

          if (!Array.isArray(parsed.themes)) {
            reject(
              new Error(
                `Shopify response for /admin/themes.json is not an array. ${JSON.stringify(
                  parsed,
                  null,
                  '\t',
                )}`,
              ),
            );
            return;
          }

          const mainTheme = parsed.themes.find((t) => t.role === 'main');

          if (!mainTheme) {
            reject(
              new Error(
                `No main theme in response. ${JSON.stringify(
                  parsed.themes,
                  null,
                  '\t',
                )}`,
              ),
            );
            return;
          }

          resolve(mainTheme.id);
        });
      },
    );
  });
}

module.exports = {
  sync(files = []) {
    if (!files.length) {
      return Promise.reject(new Error('No files to deploy.'));
    }

    filesToDeploy = [...new Set([...filesToDeploy, ...files])];

    return maybeDeploy();
  },

  replace() {
    return deploy('deploy', true);
  },

  upload() {
    return deploy('deploy', false);
  },

  fetchMainThemeId,
};
