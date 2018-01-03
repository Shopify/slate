const path = require('path');

module.exports = {
  defaultStarter: 'shopify/starter-theme',
  shopifyConfig: {
    src: path.join(__dirname, 'shopify.yml'),
    dest: path.join('config', 'shopify.yml'),
  },
};
