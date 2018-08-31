const browserSync = require('browser-sync');
const {getStoreValue, getThemeIdValue} = require('@shopify/slate-env');
const {getSSLKeyPath, getSSLCertPath} = require('../utilities');
const config = require('../../slate-tools.config');

class DevServer {
  constructor(options) {
    this.bs = browserSync.create();
    this.target = `https://${getStoreValue()}`;
    this.themeId = getThemeIdValue();
    this.port = options.port;
    this.domain = options.domain;
    this.uiPort = options.uiPort;
    this.proxyTarget =
      this.target +
      (this.themeId === 'live' ? '' : `?preview_theme_id=${this.themeId}`);
  }
  start() {
    const bsConfig = {
      port: this.port,
      proxy: {
        target: this.proxyTarget,
        middleware: (req, res, next) => {
          // Shopify sites with redirection enabled for custom domains force redirection
          // to that domain. `?_fd=0` prevents that forwarding.
          const prefix = req.url.indexOf('?') > -1 ? '&' : '?';
          const queryStringComponents = ['_fd=0'];

          req.url += prefix + queryStringComponents.join('&');
          next();
        },
      },
      https: {key: getSSLKeyPath(), cert: getSSLCertPath()},
      logLevel: 'silent',
      socket: {
        domain: `${this.domain}:${this.port}`,
      },
      ui: {
        port: this.uiPort,
      },
    };

    return new Promise((resolve) => {
      this.server = this.bs.init(bsConfig, resolve);
    });
  }
}

module.exports = DevServer;
