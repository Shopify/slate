var npm = require('global-npm');
var path = require('path');
var slateRoot = path.resolve(__dirname, '../..');
var destRoot = process.cwd();
var destName = destRoot.split(path.sep).pop();

module.exports = function(args/*, options*/) {
  if (args.length === 0) {
    process.stdout.write('No generator specified, please use one of the following:\n ' +
      ' new theme\n');

  } else {
    npm.load({prefix: slateRoot, loglevel: 'silent'}, function(err) {
      if (err) { throw err; }

      switch (args[0]) {
      case 'theme':
        npm.commands.run(['generate-theme', destName, destRoot]);
        break;

      default:
        process.stdout.write('Unknown generator, please use one of the following:\n' +
          ' new theme\n');
      }
    });
  }
};
