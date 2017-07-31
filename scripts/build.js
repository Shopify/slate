#!/usr/bin/env node

const fs = require('fs');
const archiver = require('archiver');

/**
 * Builds a zip based on an array of directories and files. This
 * script is used for shipit and should not be called explicitly.
 *
 * @param name Name of the built zip file
 * @param directories Directories to include as part of the zip
 * @param files Files to include as part of the zip
 */
function _buildZip(name, directories = [], files = []) {
  const output = fs.createWriteStream(`packages/slate-theme/upload/${name}.zip`);
  const archive = archiver('zip');

  output.on('close', () => {
    console.log(`${name}.zip: ${archive.pointer()} total bytes`);
  });

  archive.on('error', (err) => {
    throw err;
  });

  archive.pipe(output);

  directories.forEach((directory) => {
    archive.directory(directory);
  });

  files.forEach((file) => {
    archive.file(file);
  });

  archive.finalize();
}

_buildZip('slate-src', ['packages/slate-theme/src'], ['packages/slate-theme/config-sample.yml', 'packages/slate-theme/.gitignore-sample']);
