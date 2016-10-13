const spawn = require('child_process').spawn;
const config = require('../includes/config');

module.exports = function(program, debug) {

  program
    .command('deploy')
    .alias('d')
    .description('Build theme and replace theme files on specified environment(s).')
    .option('-e, --environment', 'deploy to a comma-separated list of environments')
    .option('-m, --manual', 'disable auto-deployment of the theme files')
    .action(() => {
      debug(JSON.stringify(config, 0, 2));

      spawn('gulp', ['build', '--gulpfile', config.gulpFile, '--cwd', config.themeRoot], {
        stdio: 'inherit'
      });
    });
};
