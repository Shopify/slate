const {exec} = require('child_process');
const {promisify} = require('util');

const config = require('../../slate-tools.config');

async function prettier({scripts, styles, json} = {}) {
  const executable = config.paths.prettier.bin;
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
