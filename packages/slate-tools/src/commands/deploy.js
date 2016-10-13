const spawn = require('child_process').spawn;
const config = require('./includes/config');

module.exports = function(program) {

  program
    .command('deploy')
    .alias('d')
    .description('Build theme and replace theme files on specified environment(s).')
    .option('-e, --environment', 'deploy to a comma-separated list of environments')
    .option('-m, --manual', 'disable auto-deployment of the theme files')
    .action(() => {
      const gulp = spawn('gulp', ['deploy', '--gulpfile', config.gulpFile, '--cwd', config.themeRoot]);
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
