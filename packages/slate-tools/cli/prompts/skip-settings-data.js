const chalk = require('chalk');
const inquirer = require('inquirer');
const figures = require('figures');
const minimatch = require('minimatch');
const {argv} = require('yargs');
const {getIgnoreFilesValue} = require('@yourwishes/slate-env');
const SlateConfig = require('@yourwishes/slate-config');

const config = new SlateConfig(require('../../slate-tools.schema'));

const question = {
  type: 'confirm',
  name: 'ignoreSettingsData',
  message: ' Skip uploading settings_data.json?',
  default: false,
};

function _includesSettingsData(files) {
  const settingsData = files.filter((file) =>
    file.endsWith('settings_data.json'),
  );
  return settingsData.length > 0;
}

function _filterIgnoredFiles(files) {
  const envIgnoreGlobs = getIgnoreFilesValue().split(':');
  let y = envIgnoreGlobs.map((glob) => {
    if (glob[0] !== '/') glob = `/${glob}`;

    return files.filter(minimatch.filter(glob));
  });

  const f = x => x.reduce((x,y) => {
    return [...x, ...(Array.isArray(y) ? f(y) : [y])]
  }, []);

  return f(y);
}

module.exports = async function(files) {
  const ignoredFiles = _filterIgnoredFiles(files);

  if (
    _includesSettingsData(ignoredFiles) ||
    !_includesSettingsData(files) ||
    !config.get('cli.promptSettings') ||
    argv.skipPrompts
  ) {
    return Promise.resolve(question.default);
  }

  console.log(
    `\n${chalk.yellow(
      figures.warning,
    )}  It looks like you are about to upload the ${chalk.bold(
      'settings_data.json',
    )} file.\n` +
      `   This can reset any theme setting customizations you have done in the\n` +
      `   Theme Editor. To always ignore uploading ${chalk.bold(
        'settings_data.json',
      )}, add the\n` +
      `   following to your ${chalk.bold('.env')} file: \n`,
  );
  console.log(
    `${chalk.cyan('      SLATE_IGNORE_FILES=/config/settings_data.json')}\n`,
  );
  console.log(
    `   Or to disable this prompt, add the following to your slate.config.js file:\n`,
  );
  console.log(`      ${chalk.cyan(`'cli.promptSettings': false`)}\n`);

  const answer = await inquirer.prompt([question]);

  return answer.ignoreSettingsData;
};
