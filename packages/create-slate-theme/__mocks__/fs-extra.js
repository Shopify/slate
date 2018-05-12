const fs = jest.genMockFromModule('fs-extra');
const path = require('path');

let __mockFiles = Object.create(null);

function __resetMockFiles() {
  __mockFiles = Object.create(null);
}

function __addMockFiles(newMockFiles) {
  for (const file in newMockFiles) {
    if (newMockFiles.hasOwnProperty(file)) {
      const dir = path.resolve(path.dirname(file));

      if (!__mockFiles[dir]) {
        __mockFiles[dir] = [];
      }
      __mockFiles[dir].push(path.basename(file));
    }
  }
}

function __getMockFiles() {
  return __mockFiles;
}

function copy(source, output) {
  const resolvedSource = path.resolve(source);
  const resolvedOutput = path.resolve(output);

  if (path.extname(source)) {
    const file = {};
    file[resolvedOutput] = '';
    __addMockFiles(file);
  } else {
    if (!__mockFiles[resolvedOutput]) {
      __mockFiles[resolvedOutput] = [];
    }

    __mockFiles[resolvedOutput].push(...__mockFiles[resolvedSource]);
  }
}

function remove(dir) {
  delete __mockFiles[dir];
}

function readdirSync(dir) {
  return __mockFiles[path.resolve(dir)] || [];
}

function existsSync(file) {
  const resolvedPath = path.resolve(file);
  const dir = path.dirname(resolvedPath);
  const basename = path.basename(resolvedPath);

  return (
    typeof __mockFiles[resolvedPath] === 'object' ||
    (typeof __mockFiles[dir] === 'object' &&
      __mockFiles[dir].indexOf(basename) !== -1)
  );
}

function chdir(dir) {
  if (dir !== path.resolve('test-project')) {
    process.__chdir(dir);
  }
}

function mkdirp(dir) {
  return new Promise((resolve) => {
    __mockFiles[path.resolve(dir)] = __mockFiles[path.resolve(dir)] || [];
    resolve();
  });
}

process.__chdir = process.chdir;
process.chdir = chdir;

fs.__resetMockFiles = __resetMockFiles;
fs.__addMockFiles = __addMockFiles;
fs.__getMockFiles = __getMockFiles;

fs.copy = copy;
fs.existsSync = existsSync;
fs.remove = remove;
fs.mkdirp = mkdirp;
fs.readdirSync = readdirSync;

module.exports = fs;
