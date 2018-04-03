const config = require('../../slate-tools.config');

module.exports = (...params) =>
  new RegExp([...config.webpackCommonExcludes, ...params].join('|'));
