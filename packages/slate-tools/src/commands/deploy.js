import spawn from 'cross-spawn';
import debug from 'debug';
import config from '../config';

const logger = debug('slate-tools:deploy');

export default function(program) {
  program
    .command('deploy')
    .alias('d')
    .description('Runs a full deploy of your theme\'s code to a Shopify store specified in config.yml. Existing files will be overwritten.')
    .option('-e, --env <environment>[,<environment>...]', 'Shopify store(s) to deploy code to (specified in config.yml - default: development)', 'development')
    .option('-m, --manual', 'outputs the compiled theme files to <theme>/upload/<theme>.zip for manual deployment')
    .action((options = {}) => {
      logger(`--gulpfile ${config.gulpFile}`);
      logger(`--cwd ${config.themeRoot}`);

      const args = options.manual ? ['deploy:manual'] : ['deploy', '--environment', options.env];

      spawn(config.gulp, args.concat(['--gulpfile', config.gulpFile, '--cwd', config.themeRoot]), {
        detached: false,
        stdio: 'inherit',
      });
    });
}
