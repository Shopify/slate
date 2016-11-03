const spawn = require('cross-spawn');
const debug = require('debug')('slate-tools:watch');
const config = require('./includes/config');

module.exports = function(program) {
  program
    .command('watch')
    .alias('w')
    .description('Start a server to watch for changes in the theme, using Browsersync at localhost:3000 to auto-refresh the browser when files change.')
    .option('-e, --environment [environment]', 'deploy to a comma-separated list of environments', 'development')
    .option('-n, --nosync', 'watch for changes without using Browsersync')
    .action((options = {}) => {
      debug(`--gulpfile ${config.gulpFile}`);
      debug(`--cwd ${config.themeRoot}`);

      const args = ['watch', '--gulpfile', config.gulpFile, '--cwd', config.themeRoot, '--environment', options.environment];

      if (options.nosync) {
        args.push('--nosync');
      }

      debug(`args ${args}`);

      spawn(config.gulp, args, {
        detached: false,
        stdio: 'inherit',
      });
    });
};
