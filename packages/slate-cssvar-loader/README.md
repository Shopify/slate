# @shopify/slate-cssvar-loader

Finds CSS custom properties (variables) in your stylesheets and replaces them with their corresponding liquid variable found in the provided `cssVariablesPath` option.

## Install

```
npm install --save-dev @shopify/slate-cssvar-loader
```

## Usage

### webpack.config.js example

```
module.exports = {
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/,
        use: [
          {
            loader: '@shopify/slate-cssvar-loader',
          },
          {loader: 'css-loader'},
          {loader: 'sass-loader'},
        ]
      }
    ]
  }
}
```

## Configuration

The `slate-cssvar-loader` can be configured via the theme's `.slaterc` file.

### .slaterc example

```json
{
  "cssVarLoaderEnable": true,
  "cssVarLoaderLiquidPath": ["src/snippets/css-variables.liquid"]
}
```

* `cssVarLoaderEnable`: Enable/disable cssvar loader plugin
* `cssVarLoaderLiquidPath`: An array of string paths to liquid files that associate css variables to liquid variables
