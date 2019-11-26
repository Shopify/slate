const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const chalk = require('chalk');
const SlateConfig = require('@shopify/slate-config');

const config = new SlateConfig(require('../../slate-tools.schema'));

/**
 * Builds a zip based on an array of directories and files. This
 * script is used for shipit and should not be called explicitly.
 */

const zipName = fs.existsSync(config.get('paths.theme.packageJson'))
  ? require(config.get('paths.theme.packageJson')).name
  : 'theme-zip';
const zipPath = getZipPath(config.get('paths.theme'), zipName, 'zip');
const output = fs.createWriteStream(zipPath);
const archive = archiver('zip');

if (!fs.existsSync(config.get('paths.theme.dist'))) {
  console.log(
    chalk.red(
      `${config.get('paths.theme.dist')} was not found. \n` +
        'Please run the Slate Build script before running Slate Zip',
    ),
  );

  process.exit();
}

output.on('close', () => {
  console.log(`${path.basename(zipPath)}: ${archive.pointer()} total bytes`);
});

archive.on('warning', (err) => {
  if (err.code === 'ENOENT') {
    console.log(err);
  } else {
    throw err;
  }
});

archive.on('error', (err) => {
  throw err;
});

archive.pipe(output);
archive.directory(config.get('paths.theme.dist'), '/');
archive.finalize();

function getZipPath(dir, name, ext) {
  const proposedPath = path.resolve(dir, `${name}.${ext}`);
  if (!fs.existsSync(proposedPath)) {
    return proposedPath;
  }

  for (let i = 1; ; i++) {
    const tryPath = path.resolve(dir, `${name} (${i}).${ext}`);

    if (!fs.existsSync(tryPath)) {
      return tryPath;
    }
  }
}
