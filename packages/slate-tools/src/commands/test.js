const spawn = require('child_process').spawn;
const config = require('./includes/config');

module.exports = function(program) {

  program
    .command('test')
    .alias('t')
    .description('Test and lint JavaScript, CSS and JSON files in the theme.')
    .action(() => {
      const gulp = spawn('gulp', ['test', '--gulpfile', config.gulpFile, '--cwd', config.themeRoot]);
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
