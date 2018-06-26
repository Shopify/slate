const path = require('path');
const os = require('os');
const {resolveTheme, generate} = require('@shopify/slate-config');

module.exports = generate({
  id: 'slateTools',
  items: [
    {
      id: 'webpackCommonExcludes',
      default: ['node_modules', 'assets/static/'],
      description: 'Paths to exclude for all webpack loaders',
      type: 'array',
    },
    {
      id: 'babelLoaderEnable',
      default: true,
      description: 'Enable/disable Babel for theme scripts',
      type: 'boolean',
    },
    {
      id: 'babelLoaderConfigPath',
      default: resolveTheme('.babelrc'),
      description: 'A path to a valid Babel configuration',
      type: 'path',
    },
    {
      id: 'cssnanoSettings',
      default: {zindex: false},
      description: 'Optimization settings for the cssnano plugin',
      type: 'object',
    },
    {
      id: 'promptSettings',
      description:
        'Enable/disable the prompt to skip uploading settings_data.json',
      default: true,
    },
    {
      id: 'extends',
      items: [
        {
          id: 'dev',
          default: {},
        },
        {
          id: 'prod',
          default: {},
        },
      ],
    },
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
          id: 'static',
          items: [
            {
              id: 'src',
              default: resolveTheme('src/assets/static'),
            },
            {
              id: 'dist',
              default: resolveTheme('dist/assets'),
            },
          ],
        },
        {
          id: 'scripts',
          default: resolveTheme('src/assets/scripts'),
        },
        {
          id: 'svgs',
          default: resolveTheme('src/assets/svg'),
        },
        {
          id: 'fonts',
          items: [
            {
              id: 'src',
              default: resolveTheme('src/assets/fonts'),
            },
            {
              id: 'dist',
              default: resolveTheme('dist/assets'),
            },
          ],
        },
        {
          id: 'images',
          items: [
            {
              id: 'src',
              default: resolveTheme('src/assets/images'),
            },
            {
              id: 'dist',
              default: resolveTheme('dist/assets'),
            },
          ],
        },
        {
          id: 'locales',
          items: [
            {
              id: 'src',
              default: resolveTheme('src/locales'),
            },
            {
              id: 'dist',
              default: resolveTheme('dist/locales'),
            },
          ],
        },
        {
          id: 'settings',
          items: [
            {
              id: 'src',
              default: resolveTheme('src/config'),
            },
            {
              id: 'dist',
              default: resolveTheme('dist/config'),
            },
          ],
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
          id: 'templates',
          default: resolveTheme('src/templates'),
        },
        {
          id: 'customersTemplates',
          default: resolveTheme('src/templates/customers'),
        },
        {
          id: 'entrypoints',
          items: [
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
          id: 'snippets',
          items: [
            {
              id: 'src',
              default: resolveTheme('src/snippets'),
            },
            {
              id: 'dist',
              default: resolveTheme('dist/snippets'),
            },
          ],
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
              id: 'repo',
              default: path.resolve(__dirname, '../../node_modules'),
            },
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
          id: 'themelint',
          items: [
            {
              id: 'bin',
              default: path.resolve(__dirname, 'node_modules/.bin/theme-lint'),
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
