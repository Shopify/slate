const fs = require('fs');
const execSync = require('child_process').execSync;
const SlateConfig = require('@shopify/slate-config');

const config = new SlateConfig(require('../../slate-tools.schema'));

function stylelint({fix} = {}) {
  const executable = config.get('stylelint.bin');
  const fixFlag = fix ? '--fix' : '';
  const glob = `./**/*.{${['css', 'scss', 'sass'].join(',')}}`;
  const stylelintConfig = `--config ${config.get('stylelint.config')}`;
  const ignorePath = fs.existsSync(config.get('stylelint.ignorePath'))
    ? `--ignore-path ${config.get('stylelint.ignorePath')}`
    : '';

  execSync(
    `${JSON.stringify(
      executable,
    )} "${glob}" ${stylelintConfig} ${fixFlag} ${ignorePath}`,
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
