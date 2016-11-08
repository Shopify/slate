import {join, normalize} from 'path';
import findRoot from 'find-root';

const workingDirectory = process.cwd();
const currentDirectory = __dirname;

const themeRoot = findRoot(workingDirectory);

const config = {
  gulpFile: join(currentDirectory, 'gulpfile.js'),
  gulp: join(themeRoot, normalize('node_modules/.bin/gulp')),
  themeRoot,
};

export default config;
