const config = require('./config');

module.exports = (...params) =>
  new RegExp([...config.webpackCommonExcludes, ...params].join('|'));
