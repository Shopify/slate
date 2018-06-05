const execSync = require('child_process').execSync;

const config = require('../../slate-tools.config');

function stylelint({fix} = {}) {
  const executable = config.paths.stylelint.bin;
  const fixFlag = fix ? '--fix' : '';
  const glob = `./**/*.{${['css', 'scss', 'sass'].join(',')}}`;
  const ignorePatterns = ['dist', 'node_modules'].reduce(
    (buffer, pattern) => `${buffer} --ignore-pattern ${pattern}`,
    '',
  );

  execSync(
    `${JSON.stringify(executable)} "${glob}" ${ignorePatterns} ${fixFlag}`,
    {
      stdio: 'inherit',
    },
  );
}

module.exports.stylelint = stylelint;

module.exports.runStylelint = function runStylelint() {
  console.log('Linting style files...\n');
  stylelint();
};

module.exports.runStylelintFix = function runStylelintFix() {
  stylelint({fix: true});
};
