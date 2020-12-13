import { config } from "./Config";
import { getFileName } from "./File";
import * as path from 'path';
import * as fs from 'fs';

export type SlateEnv = {
  SLATE_STORE:string;
  SLATE_PASSWORD:string;
  SLATE_THEME_ID:string;
  SLATE_IGNORE_FILES?:string;
};

export const SLATE_ENV_VARS:string[] = [
  config.get('env.keys.name'),
  config.get('env.keys.store'),
  config.get('env.keys.password'),
  config.get('env.keys.themeId'),
  config.get('env.keys.ignoreFiles'),
  config.get('env.keys.timeout')
];

export const DEFAULT_ENV_VARS:string[] = [
  config.get('env.keys.store'),
  config.get('env.keys.password'),
  config.get('env.keys.themeId'),
  config.get('env.keys.ignoreFiles'),
];

/**
 * Returns the default slate env configuration
 */
export const getDefaultSlateEnv = () => {
  const env= {};

  DEFAULT_ENV_VARS.forEach((key) => {
    env[key] = '';
  });

  return env as SlateEnv;
}

export const setEnvName = (name?:string) => {
  let envName = name;
  const envFileName = getFileName(name);
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

export const getSlateEnv = () => {
  const env = {};

  SLATE_ENV_VARS.forEach((key) => {
    env[key] = process.env[key];
  });

  return env as SlateEnv;
}

export const getEmptySlateEnv = () => {
  const env = {};

  SLATE_ENV_VARS.forEach((key) => {
    env[key] = '';
  });

  return env as SlateEnv;
}