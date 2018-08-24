const path = require('path');
const {existsSync, readFileSync} = require('fs');
const config = require('../../slate-tools.config');

function sslKeyCert() {
  const key = readFileSync(getSSLKeyPath());
  const cert = readFileSync(getSSLCertPath());

  return {key, cert};
}

function getSSLKeyPath() {
  return existsSync(config.paths.ssl.key)
    ? config.paths.ssl.key
    : path.join(__dirname, './server.pem');
}

function getSSLCertPath() {
  return existsSync(config.paths.ssl.cert)
    ? config.paths.ssl.cert
    : path.join(__dirname, './server.pem');
}

module.exports = {sslKeyCert, getSSLKeyPath, getSSLCertPath};
