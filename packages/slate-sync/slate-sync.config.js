const {resolveTheme, generate} = require('@shopify/slate-config');

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
  ],
});
