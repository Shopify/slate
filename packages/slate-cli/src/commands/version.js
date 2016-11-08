import {join, normalize} from 'path';

const currentDirectory = __dirname;
const pkg = require(join(currentDirectory, normalize('../../package.json')));

export default function(program) {
  program
    .version(pkg.version);
}
