const SlateConfig = require('@shopify/slate-config');
const config = new SlateConfig(require('../../../../slate-tools.schema'));

module.exports = (...params) =>
  new RegExp([...config.get('webpack.commonExcludes'), ...params].join('|'));
