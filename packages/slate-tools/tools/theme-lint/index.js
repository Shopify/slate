const execSync = require('child_process').execSync;

const config = require('../../slate-tools.config');

function themelint() {
  const executable = config.paths.themelint.bin;
  const dir = config.paths.src;

  execSync(`${JSON.stringify(executable)} ${dir}`, {
    stdio: 'inherit',
  });
}

module.exports.themelint = themelint;

module.exports.runThemelint = async function runThemelint() {
  console.log('Linting locales...');

  try {
    return await themelint();
  } catch (error) {
    throw error;
  }
};
