const os = require('os');
const path = require('path');

module.exports = {
  slateRcPath: path.resolve(os.homedir(), '.slaterc.json'),
};
