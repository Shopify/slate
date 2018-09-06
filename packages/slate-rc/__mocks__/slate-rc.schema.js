const os = require('os');
const path = require('path');

module.exports = {
  'paths.slateRc': path.resolve(os.homedir(), '.slaterc.json'),
};
