const path = require('path');
const os = require('os');

module.exports = {
  // Directory to look for .slaterc file
  'paths.slateRc': path.resolve(os.homedir(), '.slaterc'),
};
