const slateConfig = require('@shopify/slate-config');

module.exports = slateConfig.generate({
  items: [
    {
      id: 'babelLoaderEnable',
      default: true,
      description: 'Enable/disable Babel for theme scripts',
      type: 'boolean',
    },
    {
      id: 'babelLoaderConfigPath',
      default: slateConfig.resolveTheme('.babelrc'),
      description: 'A path to a valid Babel configuration',
      type: 'path',
    },
  ],
});
