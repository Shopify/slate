import 'babel-polyfill';
import {existsSync, mkdirSync} from 'fs';
import {join} from 'path';
import {prompt} from 'inquirer';
import rimraf from 'rimraf';
import {green, red} from 'chalk';
import figures from 'figures';
import {downloadFromUrl, unzip, startProcess, writePackageJsonSync} from '../utils';

export default function(program) {
  program
    .command('theme [name]')
    .alias('t')
    .description('Generates a new theme directory containing Slate\'s theme boilerplate.')
    .option('--yarn', 'installs theme dependencies with yarn instead of npm')
    .action(async (name, options = {}) => {
      let dirName = name;

      if (!dirName) {
        const answers = await prompt({
          type: 'input',
          name: 'dirName',
          message: 'Please enter a directory name for your theme (a new folder will be created):',
          default: 'theme',
          validate: (value) => {
            const validateName = value.match(/^[\w^'@{}[\],$=!#().%+~\- ]+$/);

            if (validateName) {
              return true;
            }

            return 'A directory name is required.';
          },
        });

        dirName = answers.dirName;
      }

      const workingDirectory = process.cwd();
      const s3Url = 'https://sdks.shopifycdn.com/slate/latest/slate-src.zip';
      const root = join(workingDirectory, dirName);

      if (existsSync(root)) {
        console.log('');
        console.error(red(`  ${figures.cross} The ${root} directory already exists`));
        console.log('');
        return null;
      }

      console.log('');
      console.log('  This may take some time...');
      console.log('');

      mkdirSync(root);

      return downloadFromUrl(s3Url, join(root, 'slate-theme.zip'))
        .then((themeZipFile) => {
          return unzip(themeZipFile, root);
        })
        .then(() => {
          console.log(`  ${green(figures.tick)} slate-theme download completed`);

          const pkg = join(root, 'package.json');

          writePackageJsonSync(pkg, dirName);

          if (options.yarn) {
            return startProcess('yarn', ['add', '@shopify/slate-tools', '--dev', '--exact'], {
              cwd: root,
            });
          } else {
            return startProcess('npm', ['install', '@shopify/slate-tools', '--save-dev', '--save-exact'], {
              cwd: root,
            });
          }
        })
        .then(() => {
          console.log(`  ${green(figures.tick)} devDependencies installed`);
          console.log(`  ${green(figures.tick)} ${dirName} theme is ready`);
          console.log('');

          return null;
        })
        .catch((err) => {
          console.error(red(`  ${err}`));

          rimraf(root, () => {
            console.log('');
            console.log('  Cleaned up theme');
            console.log('');
          });
        });
    });
}
