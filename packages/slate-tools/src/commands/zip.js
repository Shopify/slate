const spawn = require('child_process').spawn;
const config = require('./includes/config');

module.exports = function(program) {

  program
    .command('zip')
    .alias('z')
    .description('Build theme and zip compiled files. The zip file can be found within an upload folder that is generated within your theme project root folder.')
    .action(() => {
      const gulp = spawn('gulp', ['zip', '--gulpfile', config.gulpFile, '--cwd', config.themeRoot]);
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
