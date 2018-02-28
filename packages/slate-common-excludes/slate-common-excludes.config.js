const slateConfig = require('@shopify/slate-config');

module.exports = slateConfig.generate({
  id: 'slateCommonExcludes',
  items: [
    {
      id: 'webpackCommonExcludes',
      default: ['node_modules', 'assets/vendors/'],
      description: 'Paths to exclude for all webpack loaders',
      type: 'array',
    },
  ],
});
