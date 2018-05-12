const {concatStyles} = require('./concat');

module.exports = function(content) {
  const rootPath = this.resourcePath;
  const styles = concatStyles(content, rootPath, this);

  return `module.exports = ${JSON.stringify(styles)}`;
};
