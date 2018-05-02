/*
 * Run Webpack with the webpack.prod.conf.js configuration file. Write files to disk.
 *
 * If the `deploy` argument has been passed, deploy to Shopify when the compilation is done.
 */
const webpack = require('webpack');
const {event} = require('@shopify/slate-analytics');
const webpackConfig = require('../../tools/webpack/config/prod');
const packageJson = require('../../package.json');

event('slate-tools:build:start', {
  version: packageJson.version,
});

webpack(webpackConfig, (err, stats) => {
  if (err) throw err;

  event('slate-tools:build:end', {
    version: packageJson.version,
  });

  process.stdout.write(
    `${stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false,
    })}`,
  );

  console.log('');

  if (stats.compilation.errors.length) process.exit(1);
});
