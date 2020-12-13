import { config } from "./Config";
import { getDefaultSlateEnv } from "./Env";
import * as path from 'path';

/**
 * Return the default env file name, with optional name appended
 * @param name env file name
 */
export const getFileName = (name?:string):string => {
  if (typeof name === 'undefined' || name.trim() === '') {
    return config.get('env.basename');
  }
  return `${config.get('env.basename')}.${name}`;
}

/**
 * Return the file path of the env file
 * @param name name of the env file
 */
export const getFilePath = (name?:string) => {
  const envFileName = getFileName(name);
  const envPath = path.resolve(config.get('env.rootDirectory'), envFileName);
  return envPath;
}

/**
 * Return default list of env variables with their assigned value, if any.
 * @param values 
 */
export const getFileContents = (values:string[]) => {
  const env = getDefaultSlateEnv();

  for (const key in values) {
    if (values.hasOwnProperty(key) && env.hasOwnProperty(key)) {
      env[key] = values[key];
    }
  }

  return Object.entries(env)
    .map(kvp => kvp.join('='))
    .join('\r\n')
  ;
}