const browserSync = require('browser-sync');
const {getStoreValue, getThemeIdValue} = require('@shopify/slate-env');
const {getSSLKeyPath, getSSLCertPath} = require('../utilities');

class DevServer {
  constructor() {
    this.bs = browserSync.create();
    this.target = `https://${getStoreValue()}`;
  }
  start() {
    const bsConfig = {
      proxy: {
        target: this.target,
        proxyReq: (req) => {
          // Shopify sites with redirection enabled for custom domains force redirection
          // to that domain. `?_fd=0` prevents that forwarding.

          req.params = Object.assign(
            {_fd: 0, preview_theme_id: getThemeIdValue()}, // eslint-disable-line camelcase
            req.params,
          );
        },
      },
      https: {key: getSSLKeyPath(), cert: getSSLCertPath()},
      logLevel: 'silent',
    };

    return new Promise((resolve) => {
      this.server = this.bs.init(bsConfig, resolve);
    });
  }
}

module.exports = DevServer;
