const execSync = require('child_process').execSync;
const SlateConfig = require('@shopify/slate-config');

const config = new SlateConfig(require('../../slate-tools.schema'));

function themelint() {
  const executable = config.get('themelint.bin');
  const dir = config.get('paths.theme.src');

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
