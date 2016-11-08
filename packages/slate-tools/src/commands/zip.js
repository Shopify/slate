import spawn from 'cross-spawn';
import debug from 'debug';
import config from '../config';

const logger = debug('slate-tools:zip');

export default function(program) {
  program
    .command('zip')
    .alias('z')
    .description('Build theme and zip compiled files. The zip file can be found within the /upload folder that is generated within your theme project root folder.')
    .action(() => {
      logger(`--gulpfile ${config.gulpFile}`);
      logger(`--cwd ${config.themeRoot}`);

      spawn(config.gulp, ['zip', '--gulpfile', config.gulpFile, '--cwd', config.themeRoot], {
        detached: false,
        stdio: 'inherit',
      });
    });
}
