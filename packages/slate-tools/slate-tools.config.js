const fs = require('fs');
const path = require('path');
const os = require('os');
const {resolveTheme, resolveSelf, generate} = require('@shopify/slate-config');

module.exports = generate({
  id: 'slateTools',
  items: [
    {
      id: 'domain',
      default: 'https://localhost',
    },
    {
      id: 'port',
      default: 8080,
    },
    {
      id: 'regex',
      items: [
        {
          id: 'images',
          default: /\.(png|svg|jpg|gif)$/,
        },
        {
          id: 'static',
          default: /\.(liquid|json)$/,
        },
      ],
    },
    {
      id: 'paths',
      description: 'Paths used by @shopify/slate-tools',
      items: [
        {
          id: 'root',
          default: resolveTheme('./'),
        },
        {
          id: 'dist',
          default: resolveApp('dist'),
        },
        {
          id: 'src',
          default: resolveApp('src'),
        },
        {
          id: 'vendors',
          default: resolveApp('src/assets/vendors'),
        },
        {
          id: 'svgs',
          default: resolveApp('src/assets/svg'),
        },
        {
          id: 'webpack',
          default: resolveSelf('tools/webpack'),
        },
        {
          id: 'layouts',
          default: resolveApp('src/layout'),
        },
        {
          id: 'entrypoints',
          items: [
            {
              id: 'scripts',
              default: resolveApp('src/assets/scripts/theme.js'),
            },
            {
              id: 'static',
              default: resolveSelf('tools/webpack/static-files-glob.js'),
            },
          ],
        },
        {
          id: 'assetsOutput',
          default: resolveApp('dist/assets'),
        },
        {
          id: 'snippetsOutput',
          default: resolveApp('dist/snippets'),
        },
        {
          id: 'userShopifyConfig',
          default: resolveApp('config/shopify.yml'),
        },
        {
          id: 'eslint',
          items: [
            {
              id: 'rc',
              default: resolveApp('.eslintrc'),
            },
            {
              id: 'bin',
              default: resolveSelf('node_modules/.bin/eslint'),
            },
            {
              id: 'ignore',
              default: resolveApp('.eslintignore'),
            },
          ],
        },
        {
          id: 'nodeModules',
          items: [
            {
              id: 'app',
              default: resolveApp('node_modules'),
            },
            {
              id: 'self',
              default: resolveSelf('node_modules'),
            },
          ],
        },
        {
          id: 'babel',
          items: [
            {
              id: 'rc',
              default: resolveApp('.babelrc'),
            },
          ],
        },
        {
          id: 'stylelint',
          items: [
            {
              id: 'rc',
              default: resolveApp('.stylelintrc'),
            },
            {
              id: 'ignore',
              default: resolveApp('.stylelintignore'),
            },
          ],
        },
        {
          id: 'ssl',
          items: [
            {
              id: 'cert',
              default: path.resolve(os.homedir(), '.localhost_ssl/server.crt'),
            },
            {
              id: 'key',
              default: path.resolve(os.homedir(), '.localhost_ssl/server.key'),
            },
          ],
        },
        {
          id: 'packageJson',
          default: resolveApp('package.json'),
        },
      ],
    },
  ],
});
