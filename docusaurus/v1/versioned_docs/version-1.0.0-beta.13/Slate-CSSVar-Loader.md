---
id: version-1.0.0-beta.13-slate-cssvar-loader
title: Slate CSSVar Loader
original_id: slate-cssvar-loader
---

Finds CSS custom properties (variables) in your stylesheets and replaces them with their corresponding Liquid variable found in the provided `cssVariablesPath` option.

## Install

```bash
npm install --save-dev @shopify/slate-cssvar-loader
```

## Usage

### webpack.config.js example

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/,
        use: [
          {
            loader: '@shopify/slate-cssvar-loader'
          },
          { loader: 'css-loader' },
          { loader: 'sass-loader' }
        ]
      }
    ]
  }
};
```

## Configuration

The `slate-cssvar-loader` can be configured via the theme's `slate.config.js` file:

```json
{
  "cssVarLoaderEnable": true,
  "cssVarLoaderLiquidPath": ["src/snippets/css-variables.liquid"]
}
```

- `cssVarLoaderEnable`: Enable/disable CSS Variable loader plugin
- `cssVarLoaderLiquidPath`: An array of string paths to Liquid files that associate css variables to Liquid variables
