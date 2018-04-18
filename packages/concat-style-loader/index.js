const fs = require('fs');
const path = require('path');
const {getOptions} = require('loader-utils');

const {concatStyles} = require('./concat');

module.exports = function(content) {
  const options = getOptions(this);
  const rootPath = this.resourcePath;

  content = concatStyles(content, rootPath, this);

  return `module.exports = ${JSON.stringify(content)}`;
};
