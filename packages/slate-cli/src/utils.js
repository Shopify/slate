import {createReadStream, createWriteStream, rename, unlinkSync, writeFileSync, existsSync} from 'fs';
import {join, normalize} from 'path';
import {Extract} from 'unzip2';
import {get} from 'https';
import spawn from 'cross-spawn';
import mv from 'mv';

/**
 * Download file from url and write to target.
 *
 * @param {string} source - The url to the file to download.
 * @param {string} target - The path to the file destination.
 *
 * @return {string} - The path to the file destination.
 */
export function downloadFromUrl(source, target) {
  return new Promise((resolve, reject) => {
    const targetFile = createWriteStream(target);

    targetFile.on('open', () => {
      get(source, (response) => {
        response.pipe(targetFile);
      });
    });

    targetFile.on('error', (err) => {
      unlinkSync(target);
      reject(err);
    });

    targetFile.on('close', () => {
      resolve(target);
    });
  });
}

/**
 * Extract zip file to target and unlink zip file.
 *
 * @param {string} source - The path to the zip file.
 * @param {string} target - The path to the unzip destination.
 */
export function unzip(source, target) {
  return new Promise((resolve, reject) => {
    const zipFile = createReadStream(source);

    zipFile.on('error', (err) => {
      reject(err);
    });

    zipFile.on('close', () => {
      unlinkSync(source);
      resolve(target);
    });

    zipFile.pipe(Extract({
      path: target,
    }));
  });
}

/**
 * Write minimal package.json to destination.
 *
 * @param {string} target - The path to the target package.json.
 * @param {string} name - The name of the theme.
 */
export function writePackageJsonSync(target, name = 'theme') {
  const pkg = {
    name,
    version: '0.0.1',
  };

  const data = JSON.stringify(pkg, null, 2);

  writeFileSync(target, data);
}

/**
 * Rename a file path
 *
 * @param {string} current - The path to the file currently.
 * @param {string} target - The renamed path of the file.
 */
export function renameFile(current, target) {
  rename(current, target, (err) => {
    if (err) {
      throw err;
    }
  });
}

/**
 * Start a child process and stream output.
 *
 * @param {string} command - The command to run.
 * @param {string} args - List of string arguments.
 * @param {string} args - Options object
 *
 * See: https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options
 */
export function startProcess(command, args, options) {
  const defaultedOptions = options || {};
  defaultedOptions.stdio = defaultedOptions.stdio || 'inherit';

  return new Promise((resolve, reject) => {
    const child = spawn(command, args, defaultedOptions);

    child.on('error', (err) => {
      reject(err);
    });

    child.on('close', (code) => {
      resolve(code);
    });
  });
}

/**
 * Check for dependency name on package.json
 *
 * @param {string} dependencyName - The name of the dependency.
 * @param {object} pkg - The package.json object.
 */
export function hasDependency(dependencyName, pkg) {
  const depKeys = ['dependencies', 'devDependencies'];
  let hasDependencies = false;

  for (const key of depKeys) {
    if ((key in pkg && dependencyName in pkg[key])) {
      hasDependencies = true;
      break;
    }
  }

  return hasDependencies;
}

/**
 * Moves file from one location to another
 *
 * @param {string} oldPath - The path to the file.
 * @param {string} newPath - The path to the new file.
 */
export function move(oldPath, newPath) {
  return new Promise((resolve, reject) => {
    mv(oldPath, newPath, (err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}

/**
 * Tests if directory is a Shopify theme
 *
 * @param {string} directory - The path to the directory.
 */
export function isShopifyTheme(directory) {
  const layoutTheme = join(directory, normalize('layout/theme.liquid'));
  return existsSync(layoutTheme);
}

/**
 * Tests if directory belongs to Shopify themes
 *
 * @param {string} directory - The path to the directory.
 */
export function isShopifyThemeWhitelistedDir(directory) {
  const whitelist = ['assets', 'layout', 'config', 'locales', 'sections', 'snippets', 'templates'];
  return whitelist.indexOf(directory) > -1;
}
