const spawn = require('child_process').spawn;
const debug = require('debug')('slate-tools:watch');
const config = require('../config');

module.exports = function(program) {
  program
    .command('watch')
    .alias('w')
    .description('Start a server to watch for changes in the theme, using Browsersync at localhost:3000 to auto-refresh the browser when files change.')
    .option('-e, --environment', 'deploy to a comma-separated list of environments', 'development')
    .option('-n, --nosync', 'watch for changes without using Browsersync')
    .action((options = {}) => {
      debug(`--gulpfile ${config.gulpFile}`);
      debug(`--cwd ${config.themeRoot}`);

      const args = ['watch', '--gulpfile', config.gulpFile, '--cwd', config.themeRoot, '--environment', options.environment];

      if (options.nosync) {
        args.push('--nosync');
      }

      spawn('gulp', args, {
        stdio: 'inherit'
      });
    });
};
