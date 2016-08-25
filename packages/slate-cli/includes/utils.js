var npm = require('global-npm');

module.exports = {
  logHelpMsg: function(messageArray) {
    messageArray.unshift('');
    messageArray.push('\n');

    process.stdout.write(messageArray.join('\n'));
  },

  /**
   * Uses internal/programmatic npm code to execute npm scripts from an npm package
   *
   * @param dir {String} - the location (path) to execute the script from
   * @param script {Array} - the script/args sent to to `npm run`
   */
  runScript: function(dir, script) {
    npm.load({prefix: dir, loglevel: 'silent', progress: false}, function(err) {
      if (err) { throw err; }

      npm.commands.run(script, function(runErr) {
        if (runErr) { throw runErr; }
      });
    });
  }
};
