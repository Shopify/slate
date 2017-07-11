import spawn from 'cross-spawn';
import debug from 'debug';
import config from '../config';

const logger = debug('slate-tools:test');

export default function(program) {
  program
    .command('test')
    .description('Runs translation tests for a theme\'s locale files (<theme>/src/locales/).')
    .action(() => {
      logger(`--gulpfile ${config.gulpFile}`);
      logger(`--cwd ${config.themeRoot}`);

      spawn(config.gulp, ['test', '--gulpfile', config.gulpFile, '--cwd', config.themeRoot], {
        detached: false,
        stdio: 'inherit',
      }).on('close', (code) => {
        if (code === 0) { return; }

        process.exit(2);
      });
    });
}
