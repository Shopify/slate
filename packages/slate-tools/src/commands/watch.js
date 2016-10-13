const spawn = require('child_process').spawn;
const config = require('../includes/config');

module.exports = function(program, debug) {

  program
    .command('watch')
    .alias('w')
    .description('Start a server to watch for changes in the theme, using Browsersync at localhost:3000 to auto-refresh the browser when files change.')
    .option('-e, --environment', 'deploy to a comma-separated list of environments')
    .option('-n, --nosync', 'watch for changes without using Browsersync')
    .action(() => {
      debug(JSON.stringify(config, 0, 2));

      spawn('gulp', ['build', '--gulpfile', config.gulpFile, '--cwd', config.themeRoot], {
        stdio: 'inherit'
      });
    });
};
