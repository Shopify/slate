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
          default: resolveTheme('dist'),
        },
        {
          id: 'src',
          default: resolveTheme('src'),
        },
        {
          id: 'vendors',
          default: resolveTheme('src/assets/vendors'),
        },
        {
          id: 'svgs',
          default: resolveTheme('src/assets/svg'),
        },
        {
          id: 'webpack',
          default: path.resolve(__dirname, 'tools/webpack'),
        },
        {
          id: 'layouts',
          default: resolveTheme('src/layout'),
        },
        {
          id: 'entrypoints',
          items: [
            {
              id: 'scripts',
              default: resolveTheme('src/assets/scripts/theme.js'),
            },
            {
              id: 'static',
              default: path.resolve(
                __dirname,
                'tools/webpack/static-files-glob.js',
              ),
            },
          ],
        },
        {
          id: 'assetsOutput',
          default: resolveTheme('dist/assets'),
        },
        {
          id: 'snippetsOutput',
          default: resolveTheme('dist/snippets'),
        },
        {
          id: 'userShopifyConfig',
          default: resolveTheme('config/shopify.yml'),
        },
        {
          id: 'eslint',
          items: [
            {
              id: 'rc',
              default: resolveTheme('.eslintrc'),
            },
            {
              id: 'bin',
              default: path.resolve(__dirname, 'node_modules/.bin/eslint'),
            },
            {
              id: 'ignore',
              default: resolveTheme('.eslintignore'),
            },
          ],
        },
        {
          id: 'nodeModules',
          items: [
            {
              id: 'app',
              default: resolveTheme('node_modules'),
            },
            {
              id: 'self',
              default: path.resolve(__dirname, 'node_modules'),
            },
          ],
        },
        {
          id: 'babel',
          items: [
            {
              id: 'rc',
              default: resolveTheme('.babelrc'),
            },
          ],
        },
        {
          id: 'stylelint',
          items: [
            {
              id: 'rc',
              default: resolveTheme('.stylelintrc'),
            },
            {
              id: 'bin',
              default: path.resolve(__dirname, 'node_modules/.bin/stylelint'),
            },
            {
              id: 'ignore',
              default: resolveTheme('.stylelintignore'),
            },
          ],
        },
        {
          id: 'prettier',
          items: [
            {
              id: 'rc',
              default: resolveTheme('.prettierrc'),
            },
            {
              id: 'bin',
              default: path.resolve(__dirname, 'node_modules/.bin/prettier'),
            },
            {
              id: 'ignore',
              default: resolveTheme('.prettierignore'),
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
          default: resolveTheme('package.json'),
        },
        {
          id: 'cache',
          default: resolveTheme('.cache'),
        },
      ],
    },
  ],
});
