const fs = require('fs');
const createHash = require('crypto').createHash;

const config = require('../../slate-tools.config');

/**
 * Return an array of changed files that have been written to the file system.
 * Uses the same method as write-file-webpack-plugin to determine which files
 * have changed.
 * @see https://github.com/gajus/write-file-webpack-plugin/blob/master/src/index.js#L134-L145
 *
 * @param   assets  Object   Assets obejct from webpack stats.compilation object
 * @return          Array
 */

const assetsHash = {};

module.exports = function(stats) {
  const assets = stats.compilation.assets;
  let files = [];

  Object.keys(assets).forEach((key) => {
    if (key === 'static.js') {
      return;
    }

    const asset = assets[key];

    if (asset.emitted && fs.existsSync(asset.existsAt)) {
      if (key === 'scripts.js') {
        const assetHash = stats.compilation.chunks[0].hash;

        if (!assetsHash[key] || assetsHash[key] !== assetHash) {
          files = [...files, asset.existsAt.replace(config.paths.dist, '')];
          assetsHash[key] = assetHash;
        }
      } else {
        const source = asset.source();
        const assetSource = Array.isArray(source) ? source.join('\n') : source;
        const assetHash = createHash('sha256')
          .update(assetSource)
          .digest('hex');

        // new file, or existing one that changed
        if (!assetsHash[key] || assetsHash[key] !== assetHash) {
          files = [...files, asset.existsAt.replace(config.paths.dist, '')];
          assetsHash[key] = assetHash;
        }
      }
    }
  });

  return files;
};
