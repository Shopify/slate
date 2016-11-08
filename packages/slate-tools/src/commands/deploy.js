import spawn from 'cross-spawn';
import debug from 'debug';
import config from '../config';

const logger = debug('slate-tools:deploy');

export default function(program) {
  program
    .command('deploy')
    .alias('d')
    .description('Build and replace theme on specified environment(s).')
    .option('-e, --environment [environment]', 'deploy to a comma-separated list of environments', 'development')
    .option('-m, --manual', 'disable auto-deployment of the theme files, manually upload newly created zip file')
    .action((options = {}) => {
      logger(`--gulpfile ${config.gulpFile}`);
      logger(`--cwd ${config.themeRoot}`);

      const args = options.manual ? ['deploy:manual'] : ['deploy', '--environment', options.environment];

      spawn(config.gulp, args.concat(['--gulpfile', config.gulpFile, '--cwd', config.themeRoot]), {
        detached: false,
        stdio: 'inherit',
      });
    });
}
