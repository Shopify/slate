const spawn = require('child_process').spawn;
const config = require('./includes/config');

module.exports = function(program) {

  program
    .command('watch')
    .alias('w')
    .description('Start a server to watch for changes in the theme, using Browsersync at localhost:3000 to auto-refresh the browser when files change.')
    .option('-e, --environment', 'deploy to a comma-separated list of environments')
    .option('-n, --nosync', 'watch for changes without using Browsersync')
    .action(() => {
      const gulp = spawn('gulp', ['watch', '--gulpfile', config.gulpFile, '--cwd', config.themeRoot]);
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
