/* eslint-disable no-process-env */

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const config = require('./slate-env.config');

const SLATE_ENV_VARS = [
  config.envNameVar,
  config.envStoreVar,
  config.envPasswordVar,
  config.envThemeIdVar,
  config.envIgnoreFilesVar,
  config.envUserEmail,
];

const DEFAULT_ENV_VARS = [
  config.envStoreVar,
  config.envPasswordVar,
  config.envThemeIdVar,
  config.envIgnoreFilesVar,
];

// Creates a new env file with optional name and values
function create({values, name, root} = {}) {
  const envName = _getFileName(name);
  const envPath = path.resolve(root || config.envRootDir, envName);
  const envContents = _getFileContents(values);

  fs.writeFileSync(envPath, envContents);
}

// Return the default env file name, with optional name appended
function _getFileName(name) {
  if (typeof name === 'undefined' || name.trim() === '') {
    return config.envDefaultFileName;
  }

  return `${config.envDefaultFileName}.${name}`;
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
      const envVar = keyValues[0];

      // Search through config for the key which has a value of the env variable
      // e.g. find the key which has the value of 'SLATE_STORE'
      for (const key in config) {
        if (config.hasOwnProperty(key) && config[key] === envVar) {
          // Once we find the key, we can search the config.__schema for the
          // schema item. We need to schema item so we can print the description
          // comment.
          const schemaItem = config.__schema.items.find(
            (item) => item.id === key,
          );
          return `# ${schemaItem.description || ''} \r\n${keyValues.join('=')}`;
        }
      }

      return true;
    })
    .join('\r\n\r\n');
}

// Reads an .env file and assigns their values to environment variables
function assign(name) {
  const envFileName = _getFileName(name);
  const envPath = path.resolve(config.envRootDir, envFileName);
  const result = dotenv.config({path: envPath});

  if (typeof name !== 'undefined' && result.error) {
    throw result.error;
  }

  _setEnvName(name);
}

function _setEnvName(name) {
  let envName = name;
  const envFileName = _getFileName(name);
  const envPath = path.resolve(config.envRootDir, envFileName);

  if (typeof name === 'undefined') {
    if (fs.existsSync(envPath)) {
      envName = config.envDefaultEnvName;
    } else {
      envName = config.envExternalEnvName;
    }
  }

  process.env[config.envNameVar] = envName;
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
    errors.push(new Error(`${config.envStoreVar} must not be empty`));
  } else if (
    store.indexOf('.myshopify.com') < 1 &&
    store.indexOf('.myshopify.io') < 1
  ) {
    errors.push(
      new Error(`${config.envStoreVar} must be a valid .myshopify.com URL`),
    );
  }

  return errors;
}

function _validatePassword() {
  const errors = [];
  const password = getPasswordValue();

  if (password.length === 0) {
    errors.push(new Error(`${config.envPasswordVar} must not be empty`));
  } else if (!/^\w+$/.test(password)) {
    errors.push(
      new Error(
        `${config.envPasswordVar} can only contain numbers and letters`,
      ),
    );
  }

  return errors;
}

function _validateThemeId() {
  const errors = [];
  const themeId = getThemeIdValue();

  if (themeId.length === 0) {
    errors.push(new Error(`${config.envThemeIdVar} must not be empty`));
  } else if (themeId !== 'live' && !/^\d+$/.test(themeId)) {
    errors.push(
      new Error(
        `${
          config.envThemeIdVar
        } can be set to 'live' or a valid theme ID containing only numbers`,
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
  return process.env[config.envNameVar];
}

// Returns the configurable environment varible that reference the store URL
function getStoreValue() {
  const value = process.env[config.envStoreVar];
  return typeof value === 'undefined' ? '' : value;
}

function getPasswordValue() {
  const value = process.env[config.envPasswordVar];
  return typeof value === 'undefined' ? '' : value;
}

function getThemeIdValue() {
  const value = process.env[config.envThemeIdVar];
  return typeof value === 'undefined' ? '' : value;
}

function getIgnoreFilesValue() {
  const value = process.env[config.envIgnoreFilesVar];
  return typeof value === 'undefined' ? '' : value;
}

function getUserEmail() {
  const value = process.env[config.envUserEmail];
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
  getUserEmail,
};
