const fs = require('fs');
const path = require('path');
const os = require('os');
const {resolveTheme, resolveSelf, generate} = require('@shopify/slate-config');

module.exports = generate({
  id: 'slateTools',
  items: [
    {
      id: 'paths',
      description: 'Paths used by @shopify/slate-tools',
      items: [
        {
          id: 'dist',
          default: resolveTheme('dist'),
        },
      ],
    },
    {
      id: 'promptSettings',
      description:
        'Enable/disable the prompt to skip uploading settings_data.json',
      default: true,
    },
  ],
});
