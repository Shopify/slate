const spawn = require('child_process').spawn;
const debug = require('debug')('slate-tools:deploy');
const config = require('./includes/config');

module.exports = function(program) {
  program
    .command('deploy')
    .alias('d')
    .description('Build theme and replace theme files on specified environment(s).')
    .option('-e, --environment [environment]', 'deploy to a comma-separated list of environments', 'development')
    .option('-m, --manual', 'disable auto-deployment of the theme files')
    .action((options = {}) => {
      debug(`--gulpfile ${config.gulpFile}`);
      debug(`--cwd ${config.themeRoot}`);

      if (options.manual) {
        spawn(config.gulp, ['deploy:manual', '--gulpfile', config.gulpFile, '--cwd', config.themeRoot], {
          detached: false,
          stdio: 'inherit',
        });
      } else {
        spawn(config.gulp, ['deploy', '--gulpfile', config.gulpFile, '--cwd', config.themeRoot, '--environment', options.environment], {
          detached: false,
          stdio: 'inherit',
        });
      }
    });
};
