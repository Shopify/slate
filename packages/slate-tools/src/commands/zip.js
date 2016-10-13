const spawn = require('child_process').spawn;
const config = require('../includes/config');

module.exports = function(program, debug) {

  program
    .command('zip')
    .alias('z')
    .description('Build theme and zip compiled files. The zip file can be found within an upload folder that is generated within your theme project root folder.')
    .action(() => {
      debug(JSON.stringify(config, 0, 2));

      spawn('gulp', ['zip', '--gulpfile', config.gulpFile, '--cwd', config.themeRoot], {
        stdio: 'inherit'
      });
    });
};
