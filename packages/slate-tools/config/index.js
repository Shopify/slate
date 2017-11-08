const paths = require('./paths');
const YAML = require('yamljs');

module.exports = {
  paths,
  domain: 'https://localhost',
  port: 8080,
  regex: {
    images: /\.(png|svg|jpg|gif)$/,
    static: /\.(liquid|json)$/,
  },
  shopify: YAML.load(paths.userShopifyConfig),
};
