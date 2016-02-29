var fs = require('fs');
var gutil = require('gulp-util');

exports.publish = function(data, opts) {
  if (typeof opts.destination === 'undefined') {
    gutil.log('destination must be provided (via comma');
  } else {
    var docs = data().get().filter(function(doc) {
      return !doc.undocumented;
    });
    opts.destination += '/docs.json';

    fs.writeFile(opts.destination, JSON.stringify({docs: docs}, null, 2), function() {
      gutil.log('jsdoc to json:', opts.destination, 'created');
    });
  }
};
