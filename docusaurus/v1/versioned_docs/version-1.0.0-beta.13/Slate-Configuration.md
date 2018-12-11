---
id: version-1.0.0-beta.13-slate-configuration
title: Slate Configuration
original_id: slate-configuration
---

Excluding [connecting to your store](connect-to-your-store), Slate should work out of the box without any additional configuration. For developers who want to customize the default configurations of Slate, they can do so via a `slate.config.js` file found in the root of the theme.

## Editing slate.config.js

A typical `slate.config.js` could look something like below:

```js
const path = require('path');
const newPostCssPlugin = require('newPostCssPlugin');

module.exports = {
  // Configuration values can be set directly
  'webpack.babel.enable': false,

  // Or even computed when requested by Slate Config's .get() method. This allows
  // configuration items to access other configuration items. The argument passed
  // to the function is an instance of the SlateConfig() class.
  'paths.theme.src': config => path.join(config.get('paths.theme'), 'src'),

  // A function even has access to the default config value, allowing you to
  // to extend configurations
  'webpack.postcss.plugins': (config, defaultValue) => [
    newPostCssPlugin,
    ...defaultValue
  ]
};
```

## Production vs Development Builds

Sometimes you want a configuration to be different depending on if your running a production build (`slate-tools build`) or development build (`slate-tools start`). To do this, you can take advantage of the `process.env.NODE_ENV` which Slate sets to `'production'` or `'development'`:

```js
module.exports = {
  'webpack.postcss.plugins': (config) => {
    const plugins = [autoprefixer];

    // We only want to minify our CSS if we're building for production
    if (process.env.NODE_ENV === 'production') {
      plugins.push(cssnano(config.get('webpack.cssnano.settings'))
    }

    return plugins;
  },
}
```

## Configuration Values

Configurations are declared within Slate packages, across various schema files. The best way
to learn about these configurations are to explore these files:

- [paths.schema.js](https://github.com/Shopify/slate/blob/master/packages/slate-config/common/paths.schema.js)
- [slate-cssvar-loader.schema.js](https://github.com/Shopify/slate/blob/master/packages/slate-cssvar-loader/slate-cssvar-loader.schema.js)
- [slate-env.schema.js](https://github.com/Shopify/slate/blob/master/packages/slate-env/slate-env.schema.js)
- [slate-rc.schema.js](https://github.com/Shopify/slate/blob/master/packages/slate-rc/slate-rc.schema.js)
- [slate-tools.schema.js](https://github.com/Shopify/slate/blob/master/packages/slate-tools/slate-tools.schema.js)
