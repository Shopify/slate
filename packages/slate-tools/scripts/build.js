/*
 * Run Webpack with the webpack.prod.conf.js configuration file. Write files to disk.
 *
 * If the `deploy` argument has been passed, deploy to Shopify when the compilation is done.
 */
const argv = require('minimist')(process.argv.slice(2));
const chalk = require('chalk');
const webpack = require('webpack');
const webpackConfig = require('../config/webpack.prod.conf');
const config = require('../config');
const shopify = require('../lib/shopify-deploy');

webpack(webpackConfig, (err, stats) => {
  if (err) throw err;

  process.stdout.write(
    `${stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false,
    })}`
  );

  if (argv.deploy) {
    const env = require('../lib/get-shopify-env-or-die')(
      argv.env,
      config.shopify
    );

    shopify
      .overwrite(env)
      .then(() => {
        return console.log(chalk.green('\nFiles overwritten successfully!\n'));
      })
      .catch(error => {
        console.log(`\n${chalk.red(error)}\n`);
      });
  }
});
