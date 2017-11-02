const fs = require("fs");
const path = require("path");

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
  return path.resolve(__dirname, "../", relativePath);
}

module.exports = {
  root: appDirectory,
  dist: resolveApp("dist"),
  src: resolveApp("src"),
  vendors: resolveApp("src/assets/vendors"),
  lib: resolveSelf("lib"),
  nodeModules: resolveSelf("node_modules"),
  entrypoints: {
    scripts: resolveApp("src/assets/scripts/theme.js"),
    static: resolveSelf("lib/static-files-glob.js")
  },
  assetsOutput: resolveApp("dist/assets"),
  userShopifyConfig: resolveApp("config/shopify.yml"),
  eslintrc: resolveApp("./.eslintrc")
};
