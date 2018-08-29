const {exec} = require('child_process');
const {promisify} = require('util');
const SlateConfig = require('@shopify/slate-config');

const config = new SlateConfig(require('../../slate-tools.schema'));

async function prettier({scripts, styles, json} = {}) {
  const executable = config.get('prettier.bin');
  const extensions = [
    ...(scripts ? ['js'] : []),
    ...(styles ? ['css', 'scss', 'sass'] : []),
    ...(json ? ['json'] : []),
  ];
  const glob =
    extensions.length > 1
      ? `./**/*.{${extensions.join(',')}}`
      : `./**/*.${extensions.join(',')}`;

  try {
    await promisify(exec)(`${JSON.stringify(executable)} "${glob}" --write`);
  } catch (error) {
    if (typeof error.stdout !== 'string') {
      throw error;
    }
  }
}

module.exports.prettier = prettier;

module.exports.runPrettierJson = async function runPrettierJson() {
  try {
    return await prettier({json: true});
  } catch (error) {
    throw error;
  }
};
