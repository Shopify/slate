const spawn = require('child_process').spawn;
const debug = require('debug')('slate-tools:test');
const config = require('../config');

module.exports = function(program) {
  program
    .command('test')
    .alias('t')
    .description('Test and lint JavaScript, CSS and JSON files in the theme.')
    .action(() => {
      debug(`--gulpfile ${config.gulpFile}`);
      debug(`--cwd ${config.themeRoot}`);

      spawn('gulp', ['test', '--gulpfile', config.gulpFile, '--cwd', config.themeRoot], {
        stdio: 'inherit'
      });
    });
};
