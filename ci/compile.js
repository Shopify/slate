var fs = require('fs');
var path = require('path');
var ejs = require('ejs');

var dummyData = {
  name: 'testing',
  hasGitRepo: false,
  env: 'development'
};

var srcPaths = {
  package: path.resolve(__dirname, '../package.json.ejs'),
  config: path.resolve(__dirname, '../tasks/includes/config.js.ejs')
};

var destPaths = {
  package: path.resolve(__dirname, '../package.json'),
  config: path.resolve(__dirname, '../tasks/includes/config.js')
};

for (var path in srcPaths) {
  compileTemplate(srcPaths[path], destPaths[path]);
}

function compileTemplate(src, dest) {
  ejs.renderFile(src, dummyData, {}, function(err, data) {
    if (err) {
      throw err;
    }

    fs.writeFile(dest, data, 'utf8');
  });
}
