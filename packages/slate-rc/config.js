const slateConfig = require('@shopify/slate-config');
const path = require('path');
const os = require('os');

module.exports = slateConfig.generate({
  items: [
    {
      id: 'slateRcPath',
      default: path.resolve(os.homedir(), '.slaterc'),
      description: 'Directory to look for .slaterc file',
      type: 'string',
    },
  ],
});
