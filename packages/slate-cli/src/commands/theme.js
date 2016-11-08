import 'babel-polyfill';
import {existsSync, mkdirSync} from 'fs'; // eslint-disable-line node/no-deprecated-api
import {join} from 'path';
import {prompt} from 'inquirer';
import rimraf from 'rimraf';
import {green, red} from 'chalk';
import {downloadFromUrl, unzip, startProcess, writePackageJsonSync} from '../utils';

export default function(program) {
  program
    .command('theme [name]')
    .alias('th')
    .description('Generate new theme')
    .action(async function(name) {
      let dirName = name;

      if (!dirName) {
        const answers = await prompt({
          type: 'input',
          name: 'dirName',
          message: 'What do you want to name the directory for your theme?',
          default: 'theme',
          validate: (value) => {
            const validateName = value.match(/^[\w^'@{}[\],$=!#().%+~\- ]+$/);

            if (validateName) {
              return true;
            }

            return 'Please enter a directory name';
          },
        });

        dirName = answers.dirName;
      }

      const workingDirectory = process.cwd();
      const s3Url = 'https://sdks.shopifycdn.com/slate/latest/slate-src.zip';
      const root = join(workingDirectory, dirName);

      if (existsSync(root)) {
        console.log('');
        console.error(red(`  ${root} is not an empty directory`));
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
          console.log(`  ${green('✓')} slate-theme download completed`);

          const pkg = join(root, 'package.json');

          writePackageJsonSync(pkg, dirName);

          return startProcess('npm', ['install', '@shopify/slate-tools', '--save-dev', '--save-exact'], {
            cwd: root,
          });
        })
        .then(() => {
          console.log(`  ${green('✓')} devDependencies installed`);
          console.log(`  ${green('✓')} ${dirName} theme is ready`);
          console.log('');

          return;
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
