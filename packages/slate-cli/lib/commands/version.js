var pkg = require('../../package.json');

module.exports = function() {
  process.stdout.write('slate-cli: version ' + pkg.version + ' - Shopify Theme Development Framework  \n');
};
