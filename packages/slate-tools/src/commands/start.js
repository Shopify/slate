const spawn = require('child_process').spawn;
const config = require('../includes/config');

module.exports = function(program, debug) {

  program
    .command('start')
    .alias('s')
    .description('Deploy theme, launch Browsersync in a new browser tab at http://localhost:3000 and watch for file changes.')
    .option('-e, --environment', 'deploy to a comma-separated list of environments')
    .option('-n, --nosync', 'watch for changes without using Browsersync')
    .action(() => {
      debug(JSON.stringify(config, 0, 2));

      spawn('gulp', ['start', '--gulpfile', config.gulpFile, '--cwd', config.themeRoot], {
        stdio: 'inherit'
      });
    });
};
