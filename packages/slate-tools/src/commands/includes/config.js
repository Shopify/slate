const join = require('path').join;
const findRoot = require('find-root');

const currentDirectory = __dirname;
const src = join(currentDirectory, '../..');
const themeRoot = findRoot(process.cwd());

const config = {
  gulpFile: join(src, 'gulpfile.js'),
  gulp: join(themeRoot, 'node_modules/.bin/gulp'),
  themeRoot,
};

module.exports = config;
