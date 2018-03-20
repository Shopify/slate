const path = require('path');

module.exports = {
  defaultStarter: 'shopify/starter-theme',
  shopifyConfig: {
    src: path.join(__dirname, 'shopify.yml'),
    dest: path.join('config', 'shopify.yml'),
  },
  defaultOptions: {
    skipInstall: false,
    ssh: false,
  },
  validFiles: [
    '.DS_Store',
    'Thumbs.db',
    '.git',
    '.gitignore',
    '.idea',
    'README.md',
    'LICENSE',
    'web.iml',
    '.hg',
    '.hgignore',
    '.hgcheck',
  ],
};
