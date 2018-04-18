const {existsSync, readFileSync} = require('fs');
const path = require('path');

module.exports = function(config) {
  const cert = existsSync(config.paths.ssl.cert)
    ? readFileSync(config.paths.ssl.cert)
    : readFileSync(path.join(__dirname, './server.pem'));

  const key = existsSync(config.paths.ssl.key)
    ? readFileSync(config.paths.ssl.key)
    : readFileSync(path.join(__dirname, './server.pem'));

  return {key, cert};
};
