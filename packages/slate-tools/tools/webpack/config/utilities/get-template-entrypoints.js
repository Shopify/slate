const fs = require('fs');
const path = require('path');
const SlateConfig = require('@shopify/slate-config');
const config = new SlateConfig(require('../../../../slate-tools.schema'));

const VALID_LIQUID_TEMPLATES = [
  '404',
  'article',
  'blog',
  'cart',
  'collection',
  'account',
  'activate_account',
  'addresses',
  'login',
  'order',
  'register',
  'reset_password',
  'gift_card',
  'index',
  'list-collections',
  'page',
  'password',
  'product',
  'search',
];

function isValidTemplate(filename) {
  const name = VALID_LIQUID_TEMPLATES.filter((template) =>
    filename.startsWith(`${template}.`),
  );
  return Boolean(name);
}

module.exports = function() {
  const entrypoints = {};

  fs.readdirSync(config.get('paths.theme.src.templates')).forEach((file) => {
    const name = path.parse(file).name;
    const jsFile = path.join(
      config.get('paths.theme.src.scripts'),
      'templates',
      `${name}.js`,
    );

    if ((isValidTemplate(name) && fs.existsSync(jsFile) && !name.includes('product')) || (isValidTemplate(name) && fs.existsSync(jsFile) && name == 'product')) {
      entrypoints[`template.${name}`] = jsFile;
    } else if (isValidTemplate(name) && fs.existsSync(jsFile) && name.includes('product') && name !== 'product') {
      entrypoints[`template.${name}`] = [jsFile, path.join(
        config.get('paths.theme.src.scripts'),
        'templates',
        `product.js`,
      )];
    } 
  });

  fs
    .readdirSync(config.get('paths.theme.src.templates.customers'))
    .forEach((file) => {
      const name = `${path.parse(file).name}`;
      const jsFile = path.join(
        config.get('paths.theme.src.scripts'),
        'templates',
        'customers',
        `${name}.js`,
      );

      if (isValidTemplate(name) && fs.existsSync(jsFile)) {
        entrypoints[`template.${name}`] = jsFile;
      }
    });

  return entrypoints;
};