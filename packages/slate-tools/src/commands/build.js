import spawn from 'cross-spawn';
import debug from 'debug';
import config from '../config';

const logger = debug('slate-tools:build');

export default function(program) {
  program
    .command('build')
    .alias('b')
    .description('Compiles source files (<theme>/src/) into the format required for distribution to a Shopify store (<theme>/dist/).')
    .action(() => {
      spawn(config.webpack, ['--config', config.webpackConfig, '--display-error-details'], {
        detached: false,
        stdio: 'inherit',
      });
    });
}
