const {resolveTheme, generate} = require('@shopify/slate-config');

module.exports = generate({
  id: 'slateCssVarLoader',
  items: [
    {
      id: 'cssVarLoaderEnable',
      default: true,
      description: 'Enable/disable cssvar loader plugin',
      type: 'boolean',
    },
    {
      id: 'cssVarLoaderLiquidPath',
      default: [resolveTheme('src/layout/theme.liquid')],
      description:
        'An array of string paths to liquid files that associate css variables to liquid variables',
      type: 'array',
    },
  ],
});
