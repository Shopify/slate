import 'babel-polyfill';
import {existsSync, mkdirSync, readdirSync} from 'fs';
import {join} from 'path';
import {prompt} from 'inquirer';
import {green, red, yellow} from 'chalk';
import figures from 'figures';
import {downloadFromUrl, startProcess, writePackageJsonSync, move, isShopifyTheme, isShopifyThemeWhitelistedDir} from '../utils';

export default function(program) {
  program
    .command('migrate')
    .description('Converts an existing theme to work with Slate.')
    .option('--yarn', 'installs theme dependencies with yarn instead of npm')
    .action(async (options = {}) => {
      const workingDirectory = process.cwd();
      const answers = await prompt({
        type: 'confirm',
        name: 'confirmation',
        message: 'Warning! This will change your theme\'s folder structure. Are you sure you want to proceed?',
      });

      if (!answers.confirmation) {
        return;
      }

      if (!isShopifyTheme(workingDirectory)) {
        console.log('');
        console.error(yellow('  The current directory doesn\'t have /layout/theme.liquid. We have to assume this isn\'t a Shopify theme'));
        console.log('');
        console.error(red(`  ${figures.cross} Migration failed`));
        console.log('');
        return;
      }

      const configYml = join(workingDirectory, 'config.yml');
      const pkgJson = join(workingDirectory, 'package.json');
      const srcDir = join(workingDirectory, 'src');
      const iconsDir = join(srcDir, 'icons');
      const stylesDir = join(srcDir, 'styles');
      const scriptsDir = join(srcDir, 'scripts');

      console.log('');
      console.log(`  ${green(figures.tick)} Your theme is a valid Shopify theme`);
      console.log('');

      if (existsSync(srcDir)) {
        console.error(yellow('  Migrate task could not create a new src directory since your theme already has one'));
        console.error(yellow('  Please remove or rename your current src directory'));
        console.log('');
        console.error(red(`  ${figures.cross} Migration failed`));
        console.log('');
        return;
      }

      console.log(`  ${green(figures.tick)} Migration checks completed`);
      console.log('');
      console.log('  Starting migration...');
      console.log('');

      mkdirSync(srcDir);
      mkdirSync(iconsDir);
      mkdirSync(stylesDir);
      mkdirSync(scriptsDir);

      if (!existsSync(pkgJson)) {
        writePackageJsonSync(pkgJson);
      }

      function movePromiseFactory(file) {
        console.log(`  Migrating ${file} to src/...`);
        return move(join(workingDirectory, file), join(srcDir, file));
      }

      const files = readdirSync(workingDirectory);
      const whitelistFiles = files.filter(isShopifyThemeWhitelistedDir);
      const promises = whitelistFiles.map(movePromiseFactory);

      try {
        await Promise.all(promises);

        console.log('');
        console.log(`  ${green(figures.tick)} Migration to src/ completed`);
        console.log('');
        console.log('  Installing Slate dependencies...');
        console.log('');

        if (options.yarn) {
          await startProcess('yarn', ['add', '@shopify/slate-tools', '--dev', '--exact'], {
            cwd: workingDirectory,
          });
        } else {
          await startProcess('npm', ['install', '@shopify/slate-tools', '--save-dev', '--save-exact'], {
            cwd: workingDirectory,
          });
        }

        console.log('');
        console.log(`  ${green(figures.tick)} Slate dependencies installed`);
        console.log('');

        if (!existsSync(configYml)) {
          const configUrl = 'https://raw.githubusercontent.com/Shopify/slate/master/config-sample.yml';

          await downloadFromUrl(configUrl, join(workingDirectory, 'config.yml'));

          console.error(`  ${green(figures.tick)} Configuration file generated`);
          console.error(yellow('  Your theme was missing config.yml in the root directory. Please open and edit it before using Slate commands'));
          console.log('');
        }

        console.log(`  ${green(figures.tick)} Migration complete!`);
        console.log('');
      } catch (err) {
        console.error(red(`  ${err}`));
        console.log('');
        console.error(red(`  ${figures.cross} Migration failed. Please check src/ directory`));
        console.log('');
      }
    });
}
