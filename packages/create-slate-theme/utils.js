const {execSync} = require('child_process');
const execa = require('execa');

function spawn(cmd, options = {stdio: 'inherit'}) {
  const [file, ...args] = splitCommandString(cmd);
  return execa(file, args, options);
}

function splitCommandString(cmd) {
  const regexp = /[^\s"]+|"([^"]*)"/gi;
  const parts = [];
  let match;

  do {
    // Each call to exec returns the next regex match as an array
    match = regexp.exec(cmd);

    if (match != null) {
      // Index 1 in the array is the captured group if it exists
      // Index 0 is the matched text, which we use if no captured group exists
      parts.push(match[1] ? match[1] : match[0]);
    }
  } while (match != null);

  return parts;
}

// Checks the existence of yarn package
// We use yarnpkg instead of yarn to avoid conflict with Hadoop yarn
// Refer to https://github.com/yarnpkg/yarn/issues/673
//
// Returns true if yarn exists, false otherwise
function shouldUseYarn() {
  try {
    execSync('yarnpkg --version', {stdio: 'ignore'});
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = {
  spawn,
  shouldUseYarn,
  splitCommandString,
};
