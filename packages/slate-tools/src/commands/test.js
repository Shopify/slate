const spawn = require('child_process').spawn;
const config = require('../includes/config');

module.exports = function(program, debug) {

  program
    .command('test')
    .alias('t')
    .description('Test and lint JavaScript, CSS and JSON files in the theme.')
    .action(() => {
      debug(JSON.stringify(config, 0, 2));

      spawn('gulp', ['test', '--gulpfile', config.gulpFile, '--cwd', config.themeRoot], {
        stdio: 'inherit'
      });
    });
};
