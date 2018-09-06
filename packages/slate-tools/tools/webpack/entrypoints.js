const fs = require('fs');
const path = require('path');
const SlateConfig = require('@shopify/slate-config');

const config = new SlateConfig(require('../../slate-tools.schema'));

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

function templateFiles() {
  const entrypoints = {};

  fs.readdirSync(config.get('paths.theme.src.templates')).forEach((file) => {
    const name = path.parse(file).name;
    const jsFile = path.join(
      config.get('paths.theme.src.scripts'),
      'templates',
      `${name}.js`,
    );
    if (VALID_LIQUID_TEMPLATES.includes(name) && fs.existsSync(jsFile)) {
      entrypoints[`template.${name}`] = jsFile;
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
      if (VALID_LIQUID_TEMPLATES.includes(name) && fs.existsSync(jsFile)) {
        entrypoints[`template.${name}`] = jsFile;
      }
    });

  return entrypoints;
}

function layoutFiles() {
  const entrypoints = {};
  fs.readdirSync(config.get('paths.theme.src.layouts')).forEach((file) => {
    const name = path.parse(file).name;
    const jsFile = path.join(
      config.get('paths.theme.src.scripts'),
      'layout',
      `${name}.js`,
    );
    if (fs.existsSync(jsFile)) {
      entrypoints[`layout.${name}`] = jsFile;
    }
  });
  return entrypoints;
}

function entrypointFiles() {
  return Object.assign({}, layoutFiles(), templateFiles());
}

module.exports = {
  templateFiles,
  layoutFiles,
  entrypointFiles,
};
