const spawn = require('child_process').spawn;
const debug = require('debug')('slate-tools:build');
const config = require('./includes/config');

module.exports = function(program) {
  program
    .command('build')
    .alias('b')
    .description('Compile theme files and assets into a Shopify theme.')
    .action(() => {
      debug(`--gulpfile ${config.gulpFile}`);
      debug(`--cwd ${config.themeRoot}`);

      spawn('gulp', ['build', '--gulpfile', config.gulpFile, '--cwd', config.themeRoot], {
        detached: false,
        stdio: 'inherit'
      });
    });
};
