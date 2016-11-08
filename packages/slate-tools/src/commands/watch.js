const spawn = require('cross-spawn');
const debug = require('debug')('slate-tools:watch');
const config = require('./includes/config');

module.exports = function(program) {
  program
    .command('watch')
    .alias('w')
    .description('Watch for file changes and upload changed files on specified environment.')
    .option('-e, --environment [environment]', 'deploy to a comma-separated list of environments', 'development')
    .action((options = {}) => {
      debug(`--gulpfile ${config.gulpFile}`);
      debug(`--cwd ${config.themeRoot}`);

      const args = ['watch', '--gulpfile', config.gulpFile, '--cwd', config.themeRoot, '--environment', options.environment];

      spawn(config.gulp, args, {
        detached: false,
        stdio: 'inherit',
      });
    });
};
