const fs = require('fs');
const path = require('path');
const os = require('os');

const appDirectory = fs.realpathSync(process.cwd());

/**
 * Resolve a relative path to the app directory
 *
 * @return String
 */
function resolveApp(relativePath) {
  return path.resolve(appDirectory, relativePath);
}

/**
 * Resolve a relative path to the tool directory
 *
 * @return String
 */
function resolveSelf(relativePath) {
  return path.resolve(__dirname, '../', relativePath);
}

module.exports = {
  root: appDirectory,
  dist: resolveApp('dist'),
  src: resolveApp('src'),
  vendors: resolveApp('src/assets/vendors'),
  svgs: resolveApp('src/assets/svg'),
  lib: resolveSelf('lib'),
  entrypoints: {
    scripts: resolveApp('src/assets/scripts/theme.js'),
    static: resolveSelf('lib/static-files-glob.js'),
  },
  assetsOutput: resolveApp('dist/assets'),
  snippetsOutput: resolveApp('dist/snippets'),
  userShopifyConfig: resolveApp('config/shopify.yml'),
  eslint: {
    rc: resolveApp('.eslintrc'),
    bin: resolveSelf('node_modules/.bin/eslint'),
    ignore: resolveApp('.eslintignore'),
  },
  nodeModules: {
    app: resolveApp('node_modules'),
    self: resolveSelf('node_modules'),
  },
  babel: {
    rc: resolveApp('.babelrc'),
  },
  stylelint: {
    rc: resolveApp('.stylelintrc'),
    ignore: resolveApp('.stylelintignore'),
  },
  ssl: {
    cert: path.resolve(os.homedir(), '.localhost_ssl/server.crt'),
    key: path.resolve(os.homedir(), '.localhost_ssl/server.key'),
  },
  packageJson: resolveApp('package.json'),
};
