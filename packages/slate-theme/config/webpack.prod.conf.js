const path = require('path');

module.exports = {
  resolve: {
    alias: {
      jquery: path.resolve('./node_modules/jquery'),
      'lodash-es': path.resolve('./node_modules/lodash-es'),
    },
  },
};
