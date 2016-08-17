var utils = require('../includes/utils.js');

module.exports = {
  command: function() {
    utils.logHelpMsg([
      'Usage: slate <command> [args] [--options]',
      '',
      'Global options:',
      '',
      '  -h, --help              output help information for Slate or a specific command',
      '  -v, --version           output the version number',
      '',
      'Global commands:',
      '',
      '  setup                   install framework dependencies',
      '  version                 output the current version',
      '  new [args]              scaffold a theme or section',
      '',
      'Theme commands:',
      '',
      '  build                   compile theme files and assets',
      '  deploy [--options]      replace theme on specified environment',
      '  start [--options]       deploy theme and watch for file changes',
      '  test                    test/lint theme JavaScript, CSS and JSON',
      '  watch [--options]       watch for file changes',
      '  zip                     zip compiled theme files',
      '',
      'Troubleshooting:',
      '',
      '  If you encounter any issues, here are some preliminary steps to take:',
      '    - `git pull` latest version of Slate CLI.',
      '    - `npm install` to make sure you have all the dependencies.',
      '    - `slate setup` to make sure all Slate CLI dependencies are installed.',
      '    - `npm link` to make sure that the symlink exists and Slate CLI is globally installed.'
    ]);
  }
};
