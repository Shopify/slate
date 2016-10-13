const spawn = require('child_process').spawn;
const config = require('./includes/config');

module.exports = function(program) {

  program
    .command('start')
    .alias('s')
    .description('Deploy theme, launch Browsersync in a new browser tab at http://localhost:3000 and watch for file changes.')
    .option('-e, --environment', 'deploy to a comma-separated list of environments')
    .option('-n, --nosync', 'watch for changes without using Browsersync')
    .action(() => {
      const gulp = spawn('gulp', ['start', '--gulpfile', config.gulpFile, '--cwd', config.themeRoot]);
      let errors = '';

      gulp.stdout.setEncoding('utf8');
      gulp.stdout.on('data', (data) => {
        process.stdout.write(data);
      });

      gulp.stderr.setEncoding('utf8');
      gulp.stderr.on('data', (data) => {
        errors += data;
      });

      gulp.on('error', (err) => {
        process.stderr.write(err);
      });

      gulp.on('close', () => {
        if (errors) {
          process.stderr.write(errors);
        }
      });
    });
};
