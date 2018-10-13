const fs = require('fs');
const execSync = require('child_process').execSync;
const path = require('path');
const SlateConfig = require('@shopify/slate-config');

const config = new SlateConfig(require('../../slate-tools.schema'));

function eslint({fix} = {}) {
  const executable = config.get('eslint.bin');
  const cachePath = path.join(
    config.get('paths.theme.cache'),
    'eslint-scripts',
  );
  const extensions = ['.js'];
  const fixFlag = fix ? '--fix' : '';
  const eslintConfig = `--config ${config.get('eslint.config')}`;
  const ignorePath = fs.existsSync(config.get('eslint.ignorePath'))
    ? `--ignore-path ${config.get('eslint.ignorePath')}`
    : '';

  execSync(
    // prettier-ignore
    `${JSON.stringify(executable)} . ${extensions} ${ignorePath} ${eslintConfig}` +
    ` ${fixFlag} --max-warnings 0 ` +
    `--cache true --cache-location ${JSON.stringify(`${cachePath}${path.sep}`)}`,
    {stdio: 'inherit'},
  );
}

module.exports.eslint = eslint;

module.exports.runEslint = function runEslint() {
  console.log('Linting script files...\n');
  try {
    eslint();
  } catch (error) {
    console.log(`\nESLint errors found.\n`);
  }
};

module.exports.runEslintFix = function runEslintFix() {
  try {
    eslint({fix: true});
  } catch (error) {
    console.log(`\nESLint errors found.\n`);
  }
};
