const browserSync = require('browser-sync');
const {getStoreValue, getThemeIdValue} = require('@shopify/slate-env');
const {getSSLKeyPath, getSSLCertPath} = require('../utilities');

class DevServer {
  constructor(options) {
    this.bs = browserSync.create();
    this.target = `https://${getStoreValue()}`;
    this.themeId = getThemeIdValue();
    this.port = options.port;
    this.address = options.address;
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
          // ?pb=0 hides the Shopify preview bar
          const prefix = req.url.indexOf('?') > -1 ? '&' : '?';
          const queryStringComponents = ['_fd=0&pb=0'];

          req.url += prefix + queryStringComponents.join('&');
          next();
        },
        proxyRes: [
          function(proxyRes) {
            // disable HSTS. Slate might force us to use HTTPS but having HSTS on local dev makes it impossible to do other non-Slate dev.
            delete proxyRes.headers['strict-transport-security'];
          },
        ],
      },
      https: {key: getSSLKeyPath(), cert: getSSLCertPath()},
      logLevel: 'silent',
      socket: {
        domain: `https://${this.address}:${this.port}`,
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
