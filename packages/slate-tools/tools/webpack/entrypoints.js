const fs = require('fs');
const path = require('path');
const config = require('../../slate-tools.config');

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

  fs.readdirSync(config.paths.templates).forEach((file) => {
    const name = path.parse(file).name;
    const jsFile = path.join(config.paths.scripts, 'templates', `${name}.js`);
    if (VALID_LIQUID_TEMPLATES.includes(name) && fs.existsSync(jsFile)) {
      entrypoints[`template.${name}`] = jsFile;
    }
  });

  fs.readdirSync(config.paths.customersTemplates).forEach((file) => {
    const name = `${path.parse(file).name}`;
    const jsFile = path.join(
      config.paths.scripts,
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
  fs.readdirSync(config.paths.layouts).forEach((file) => {
    const name = path.parse(file).name;
    const jsFile = path.join(config.paths.scripts, 'layout', `${name}.js`);
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
