const slateConfig = require('@shopify/slate-config');
const os = require('os');

module.exports = slateConfig.generate({
  items: [
    {
      id: 'slateRcPath',
      default: os.homedir(),
      description: 'Directory to look for .slaterc file',
      type: 'string',
    },
  ],
});
