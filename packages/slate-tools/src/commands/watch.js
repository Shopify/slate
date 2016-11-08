import spawn from 'cross-spawn';
import debug from 'debug';
import config from '../config';

const logger = debug('slate-tools:watch');

export default function(program) {
  program
    .command('watch')
    .alias('w')
    .description('Set up the watchers for all theme assets and deploy the compiled versions to your specified environment.')
    .option('-e, --environment [environment]', 'deploy to a comma-separated list of environments', 'development')
    .action((options = {}) => {
      logger(`--gulpfile ${config.gulpFile}`);
      logger(`--cwd ${config.themeRoot}`);

      const args = ['watch', '--gulpfile', config.gulpFile, '--cwd', config.themeRoot, '--environment', options.environment];

      if (options.nosync) {
        args.push('--nosync');
      }

      spawn(config.gulp, args, {
        detached: false,
        stdio: 'inherit',
      });
    });
}
