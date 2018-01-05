const fs = require('fs');
const StyleLint = require('stylelint');
const config = require('../config');

function stylelint() {
  if (!fs.existsSync(config.paths.stylelint.rc)) {
    return [];
  }

  const ignorePath = fs.existsSync(config.paths.stylelint.ignore)
    ? config.paths.stylelint.ignore
    : null;

  return [
    new StyleLint({
      configFile: config.paths.stylelint.rc,
      ignorePath,
    }),
  ];
}

module.exports = stylelint;
