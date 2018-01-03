const {execSync} = require('child_process');
const execa = require('execa');

function spawn(cmd) {
  const [file, ...args] = cmd.split(/\s+/);
  return execa(file, args, {stdio: 'inherit'});
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
};
