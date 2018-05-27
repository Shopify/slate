const execSync = require('child_process').execSync;
const path = require('path');

const config = require('../../slate-tools.config');

function eslint({fix} = {}) {
  const executable = config.paths.eslint.bin;
  const cachePath = path.join(config.paths.cache, 'eslint-scripts');
  const extensions = ['.js'];
  const ignorePatterns = ['dist', 'node_modules', 'src/assets/static'].reduce(
    (buffer, pattern) => `${buffer} --ignore-pattern ${pattern}`,
    '',
  );
  const fixFlag = fix ? '--fix' : '';

  execSync(
    // prettier-ignore
    `${JSON.stringify(executable)} . ${extensions} ${ignorePatterns} ` +
    `${fixFlag} --max-warnings 0 ` +
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
