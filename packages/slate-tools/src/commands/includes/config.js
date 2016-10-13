const path = require('path');
const findRoot = require('find-root');

const config = {
  gulpFile: path.join(__dirname, '../../gulpfile.js'),
  themeRoot: findRoot(process.cwd())
};

module.exports = config;
