# slate-cssvar-loader

Finds CSS custom properties (variables) in your stylesheets and replaces them with their corresponding liquid variable found in the provided `cssVariablesPath` option.

## Install

```
npm install --save-dev @shopify/slate-cssvar-loader
```

## Usage

**webpack.config.js**

```
module.exports = {
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/,
        use: [
          {
            loader: '@shopify/slate-cssvar-loader',
            options: {
              cssVariablesPath: config.paths.slateCssLoader.cssVariables,
            }
          },
          {loader: 'css-loader'},
          {loader: 'sass-loader'},
        ]
      }
    ]
  }
}
```