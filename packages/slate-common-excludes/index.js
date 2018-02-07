const config = require('./slate-common-excludes.config');

module.exports = (...params) =>
  new RegExp([...config.webpackCommonExcludes, ...params].join('|'));
