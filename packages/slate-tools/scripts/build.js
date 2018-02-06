/*
 * Run Webpack with the webpack.prod.conf.js configuration file. Write files to disk.
 *
 * If the `deploy` argument has been passed, deploy to Shopify when the compilation is done.
 */
const webpack = require('webpack');
const uuidGenerator = require('uuid/v4');
const {event} = require('@shopify/slate-analytics');
const webpackConfig = require('../config/webpack.prod.conf');

const id = uuidGenerator();

event('slate-tools:build:start', {id, webpackConfig});

webpack(webpackConfig, (err, stats) => {
  if (err) throw err;

  event('slate-tools:build:end', {id, webpackConfig});

  process.stdout.write(
    `${stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false,
    })}`,
  );
});
