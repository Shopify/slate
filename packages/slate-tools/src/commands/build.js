const spawn = require('child_process').spawn;
const config = require('../includes/config');

module.exports = function(program, debug) {
  program
    .command('build')
    .alias('b')
    .description('Compile theme files and assets into a Shopify theme.')
    .action(() => {
      debug(JSON.stringify(config, 0, 2));

      spawn('gulp', ['build', '--gulpfile', config.gulpFile, '--cwd', config.themeRoot], {
        stdio: 'inherit'
      });
    });
};
