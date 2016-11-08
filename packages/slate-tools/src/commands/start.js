import spawn from 'cross-spawn';
import debug from 'debug';
import config from '../config';

const logger = debug('slate-tools:start');

export default function(program) {
  program
    .command('start')
    .alias('s')
    .description('Deploy theme and watch for file changes.')
    .option('-e, --environment [environment]', 'deploy to a comma-separated list of environments', 'development')
    .action((options = {}) => {
      logger(`--gulpfile ${config.gulpFile}`);
      logger(`--cwd ${config.themeRoot}`);

      const args = ['--gulpfile', config.gulpFile, '--cwd', config.themeRoot, '--environment', options.environment];

      spawn(config.gulp, args, {
        detached: false,
        stdio: 'inherit',
      });
    });
}
