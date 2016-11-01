#!/usr/bin/env node

const fs = require('fs');
const archiver = require('archiver');
const path = require('path');
const DIST_DIR = 'upload';
const SRC_FILES = [
  '.npmignore',
  'config-sample.yml',
  'LICENSE',
  'README.md'
]

const SRC_DIRS = [
  'src'
]

module.exports = (function() {
  let output = fs.createWriteStream('upload/test.zip');
  let archive = archiver('zip');

  output.on('close', () => {
    console.log(`${archive.pointer()} total bites`);
  })

  archive.on('error', (err) => {
    throw err;
  });

  archive.pipe(output);

  for (var i in SRC_FILES) {
    archive.file(SRC_FILES[i]);
  }

  for (var i in SRC_DIRS) {
    archive.directory(SRC_DIRS[i]);
  }

  archive.finalize();

})();
