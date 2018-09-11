const SlateConfig = require('@shopify/slate-config');
const getLayoutEntrypoints = require('../utilities/get-layout-entrypoints');
const getTemplateEntrypoints = require('../utilities/get-template-entrypoints');
const config = new SlateConfig(require('../../../../slate-tools.schema'));

module.exports = {
  entry: Object.assign(
    {},
    getLayoutEntrypoints(),
    getTemplateEntrypoints(),
    config.get('webpack.entrypoints'),
  ),
};
