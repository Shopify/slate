var utils = require('../includes/utils.js');

module.exports = {
  command: function() {
    utils.logHelpMsg([
      'Usage: slate <command> [args] [--options]',
      '',
      'Global options:',
      '',
      '  -h, --help              output usage information for generic help and/or for a specific command',
      '  -v, --version           output the current version',
      '',
      'Setup commands:',
      '',
      '  setup                   install framework dependencies',
      '  version                 output the current version',
      '  new [args] [--options]  scaffold a theme or section',
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
      '  If ever you encounter any issues, running `slate setup` should fix them.'
    ]);
  }
};
