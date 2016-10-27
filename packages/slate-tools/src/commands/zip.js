const spawn = require('child_process').spawn;
const debug = require('debug')('slate-tools:zip');
const config = require('./includes/config');

module.exports = function(program) {
  program
    .command('zip')
    .alias('z')
    .description('Build theme and zip compiled files. The zip file can be found within an upload folder that is generated within your theme project root folder.')
    .action(() => {
      debug(`--gulpfile ${config.gulpFile}`);
      debug(`--cwd ${config.themeRoot}`);

      spawn(config.gulp, ['zip', '--gulpfile', config.gulpFile, '--cwd', config.themeRoot], {
        detached: false,
        stdio: 'inherit',
      });
    });
};
