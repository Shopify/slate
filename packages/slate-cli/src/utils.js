import {createReadStream, createWriteStream, unlink, unlinkSync, writeFileSync} from 'fs';
import {Extract} from 'unzip2';
import {get} from 'https';
import spawn from 'cross-spawn';

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
    const themeZipFile = createWriteStream(target);

    themeZipFile.on('open', () => {
      get(source, (response) => {
        response.pipe(themeZipFile);
      });
    });

    themeZipFile.on('error', (err) => {
      unlink(target);
      reject(err);
    });

    themeZipFile.on('close', () => {
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
 * Start a child process and stream output.
 *
 * @param {string} command - The command to run.
 * @param {string} args - List of string arguments.
 * @param {string} args - Options object, see: https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options
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
