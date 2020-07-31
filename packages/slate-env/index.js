const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const SlateConfig = require('@shopify/slate-config');
const config = new SlateConfig(require('./slate-env.schema'));

const SLATE_ENV_VARS = [
  config.get('env.keys.name'),
  config.get('env.keys.store'),
  config.get('env.keys.password'),
  config.get('env.keys.themeId'),
  config.get('env.keys.ignoreFiles'),
  config.get('env.keys.timeout')
];

const DEFAULT_ENV_VARS = [
  config.get('env.keys.store'),
  config.get('env.keys.password'),
  config.get('env.keys.themeId'),
  config.get('env.keys.ignoreFiles'),
];

// Creates a new env file with optional name and values
function create({values, name, root} = {}) {
  const envName = _getFileName(name);
  const envPath = path.resolve(
    root || config.get('env.rootDirectory'),
    envName,
  );
  const envContents = _getFileContents(values);

  fs.writeFileSync(envPath, envContents);
}

// Return the default env file name, with optional name appended
function _getFileName(name) {
  if (typeof name === 'undefined' || name.trim() === '') {
    return config.get('env.basename');
  }

  return `${config.get('env.basename')}.${name}`;
}

// Return default list of env variables with their assigned value, if any.
function _getFileContents(values) {
  const env = getDefaultSlateEnv();

  for (const key in values) {
    if (values.hasOwnProperty(key) && env.hasOwnProperty(key)) {
      env[key] = values[key];
    }
  }

  return Object.entries(env)
    .map((keyValues) => {
      return `${keyValues.join('=')}\r\n`;
    })
    .join('\r\n\r\n');
}

// Reads an .env file and assigns their values to environment variables
function assign(name) {
  const envFileName = _getFileName(name);
  const envPath = path.resolve(config.get('env.rootDirectory'), envFileName);
  const result = dotenv.config({path: envPath});

  if (typeof name !== 'undefined' && result.error) {
    throw result.error;
  }

  _setEnvName(name);
}

function _setEnvName(name) {
  let envName = name;
  const envFileName = _getFileName(name);
  const envPath = path.resolve(config.get('env.rootDirectory'), envFileName);

  if (typeof name === 'undefined') {
    if (fs.existsSync(envPath)) {
      envName = config.get('env.defaultEnvName');
    } else {
      envName = config.get('env.externalEnvName');
    }
  }

  process.env[config.get('env.keys.name')] = envName;
}

// Checks if Slate env variables are the required value types and format
function validate() {
  const errors = [].concat(
    _validateStore(),
    _validatePassword(),
    _validateThemeId(),
  );

  return {
    errors,
    isValid: errors.length === 0,
  };
}

function _validateStore() {
  const errors = [];
  const store = getStoreValue();

  if (store.length === 0) {
    errors.push(new Error(`${config.get('env.keys.store')} must not be empty`));
  } else if (
    store.indexOf('.myshopify.com') < 1 &&
    store.indexOf('.myshopify.io') < 1
  ) {
    errors.push(
      new Error(
        `${config.get('env.keys.store')} must be a valid .myshopify.com URL`,
      ),
    );
  } else if (store.slice(-1) === '/') {
    errors.push(
      new Error(
        `${config.get('env.keys.store')} must not end with a trailing slash`,
      ),
    );
  }

  return errors;
}

function _validatePassword() {
  const errors = [];
  const password = getPasswordValue();

  if (password.length === 0) {
    errors.push(
      new Error(`${config.get('env.keys.password')} must not be empty`),
    );
  } else if (!/^\w+$/.test(password)) {
    errors.push(
      new Error(
        `${config.get(
          'env.keys.password',
        )} can only contain numbers and letters`,
      ),
    );
  }

  return errors;
}

function _validateThemeId() {
  const errors = [];
  const themeId = getThemeIdValue();

  if (themeId.length === 0) {
    errors.push(
      new Error(`${config.get('env.keys.themeId')} must not be empty`),
    );
  } else if (themeId !== 'live' && !/^\d+$/.test(themeId)) {
    errors.push(
      new Error(
        `${config.get(
          'env.keys.themeId',
        )} can be set to 'live' or a valid theme ID containing only numbers`,
      ),
    );
  }

  return errors;
}

// Clears the values of environment variables used by Slate
function clear() {
  SLATE_ENV_VARS.forEach((key) => (process.env[key] = ''));
}

// Get the values of Slate's required environment variables
function getSlateEnv() {
  const env = {};

  SLATE_ENV_VARS.forEach((key) => {
    env[key] = process.env[key];
  });

  return env;
}

// Returns the Slate's required environment variables with empty values
function getEmptySlateEnv() {
  const env = {};

  SLATE_ENV_VARS.forEach((key) => {
    env[key] = '';
  });

  return env;
}

function getDefaultSlateEnv() {
  const env = {};

  DEFAULT_ENV_VARS.forEach((key) => {
    env[key] = '';
  });

  return env;
}

function getEnvNameValue() {
  return process.env[config.get('env.keys.name')];
}

// Returns the configurable environment varible that reference the store URL
function getStoreValue() {
  const value = process.env[config.get('env.keys.store')];
  return typeof value === 'undefined' ? '' : value;
}

function getPasswordValue() {
  const value = process.env[config.get('env.keys.password')];
  return typeof value === 'undefined' ? '' : value;
}

function getThemeIdValue() {
  const value = process.env[config.get('env.keys.themeId')];
  return typeof value === 'undefined' ? '' : value;
}

function getIgnoreFilesValue() {
  const value = process.env[config.get('env.keys.ignoreFiles')];
  return typeof value === 'undefined' ? '' : value;
}

function getTimeoutValue() {
  const value = process.env[config.get('env.keys.timeout')];
  return typeof value === 'undefined' ? '' : value;
}

module.exports = {
  create,
  assign,
  validate,
  clear,
  getSlateEnv,
  getDefaultSlateEnv,
  getEmptySlateEnv,
  getEnvNameValue,
  getStoreValue,
  getPasswordValue,
  getThemeIdValue,
  getIgnoreFilesValue,
  getTimeoutValue,
};
