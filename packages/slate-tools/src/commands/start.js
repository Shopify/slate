import spawn from 'cross-spawn';
import debug from 'debug';
import config from '../config';

const logger = debug('slate-tools:start');

export default function(program) {
  program
    .command('start')
    .alias('s')
    .description('Runs a clean build & deploy of the theme\'s source files to a Shopify store specified in config.yml, ' +
      'then starts file watch and live-reload tasks, allowing for immediate updates during development.')
    .option('-e, --env <environment>[,<environment>...]', 'Shopify store(s) to deploy code to (specified in config.yml - default: development)', 'development')
    .option('-n, --nosync', 'disable live-reload functionality')
    .action((options = {}) => {
      logger(`--gulpfile ${config.gulpFile}`);
      logger(`--cwd ${config.themeRoot}`);

      const args = ['--gulpfile', config.gulpFile, '--cwd', config.themeRoot, '--environment', options.env];

      if (options.nosync) {
        args.push('--nosync');
      }

      spawn(config.gulp, args, {
        detached: false,
        stdio: 'inherit',
      });
    });
}
