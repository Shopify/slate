const webpack = require('webpack');
const {createServer} = require('https');
const createHash = require('crypto').createHash;
const SlateConfig = require('@shopify/slate-config');

const App = require('./app');
const Client = require('./client');
const {sslKeyCert, isHotUpdateFile} = require('../utilities');
const config = new SlateConfig(require('../../slate-tools.schema'));

module.exports = class DevServer {
  constructor(options) {
    options.webpackConfig.output.publicPath = `https://${options.address}:${
      options.port
    }/`;

    this.assetHashes = {};
    this.address = options.address;
    this.options = options;
    this.port = options.port;
    this.compiler = webpack(options.webpackConfig);
    this.app = new App(this.compiler);
    this.client = new Client();
    this.client.hooks.afterSync.tap(
      'HotMiddleWare',
      this._onAfterSync.bind(this),
    );
  }

  start() {
    this.compiler.hooks.done.tapPromise(
      'DevServer',
      this._onCompileDone.bind(this),
    );
    this.ssl = sslKeyCert();
    this.server = createServer(this.ssl, this.app);

    this.server.listen(this.port);
  }

  set files(files) {
    this.client.files = files;
  }

  set skipDeploy(value) {
    this.client.skipNextSync = value;
  }

  _onCompileDone(stats) {
    const files = this._getAssetsToUpload(stats);

    return this.client.sync(files, stats);
  }

  _onAfterSync(files) {
    this.app.webpackHotMiddleware.publish({
      action: 'shopify_upload_finished',
      force: files.length > 0,
    });
  }

  _isChunk(key, chunks) {
    return (
      chunks.filter((chunk) => {
        return key.indexOf(chunk.id) > -1 && !this._isLiquidStyle(key);
      }).length > 0
    );
  }

  _isLiquidStyle(key) {
    return key.indexOf('styleLiquid.scss.liquid') > -1;
  }

  _hasAssetChanged(key, asset) {
    const oldHash = this.assetHashes[key];
    const newHash = this._updateAssetHash(key, asset);

    return oldHash !== newHash;
  }

  _getAssetsToUpload(stats) {
    const assets = Object.entries(stats.compilation.assets);
    const chunks = stats.compilation.chunks;

    return (
      assets
        .filter(([key, asset]) => {
          return (
            asset.emitted &&
            !this._isChunk(key, chunks) &&
            !isHotUpdateFile(key) &&
            this._hasAssetChanged(key, asset)
          );
        })
        /* eslint-disable-next-line no-unused-vars */
        .map(([key, asset]) => {
          return asset.existsAt.replace(config.get('paths.theme.dist'), '');
        })
    );
  }

  _updateAssetHash(key, asset) {
    const rawSource = asset.source();
    const source = Array.isArray(rawSource) ? rawSource.join('\n') : rawSource;
    const hash = createHash('sha256')
      .update(source)
      .digest('hex');

    return (this.assetHashes[key] = hash);
  }
};
