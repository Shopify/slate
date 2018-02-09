# @shopify/slate-config

Generates configurations for Slate packages by applying values from `slate.config.js` to override default values.

An example config file from `@shopify/slate-babel`:

```js
const slateConfig = require('@shopify/slate-config');

module.exports = slateConfig.generate({
  items: [
    {
      id: 'babelLoaderEnable',
      default: true,
      description: 'Enable/disable Babel for theme scripts',
      type: 'boolean',
    },
  ],
});
```

`slate.config.js` could override the default value of `babelLoaderEnable` by declaring the following:

```js
module.exports = {
  babelLoaderEnable: false,
};
```
