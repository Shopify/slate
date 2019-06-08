# @shopify/slate-sections-plugin

The plugin allows developers to create Shopify theme sections from a variety of files contained in a folder, and combines these files into a single Liquid section file for use on Shopify servers.

## Getting Started

First install the plugin

```
npm install @shopify/slate-sections-plugin --save-dev
```

or

```
yarn add @shopify/slate-sections-plugin --dev
```

Then add it to your webpack config, an example below.

```js
const SlateSectionsPlugin = require('@shopify/slate-sections-plugin');

const slateSectionsOptions = {
  from: '/absolute/path/to/sections/source',
  to: '/absolute/path/to/sections/output',
};

module.exports = {
  plugins: [new SlateSectionsPlugin(slateSectionsOptions)],
};
```

## Options

| Option              | Required? | Type   | Default           | Description                                                                                                                                                       |
| ------------------- | --------- | ------ | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| from                | Yes       | String | undefined         | The absolute path to the folder containing your sections, typically ./src/sections                                                                                |
| to                  | Yes       | String | undefined         | The absolute path to the folder where your sections will be outputted to, typically ./dist/sections                                                               |
| genericTemplateName | No        | String | 'template.liquid' | If you're using the 'Sections as Folders' structure, your template names by default need to be 'template.liquid'. You may change this value if you would like to. |

## Sections as Liquid Files

You may structure your sections folder by creating separate Liquid files for each section:

```bash
./sections
├── blog-posts.liquid
├── collection-list.liquid
├── featured-collection.liquid
├── featured-product.liquid
├── footer.liquid
├── header.liquid
├── image-with-text.liquid
├── newsletter.liquid
├── product.liquid
└── rich-text.liquid
```

This structure simply tells the plugin to copy the Liquid files into the `./dist` sections folder

## Sections as Folders

You can separate a schema from your Liquid template by creating a folder for each section. This increases maintainability and provides syntax highlighting for your JSON schema objects.

In order to have separate schema files, you must create a folder for the section and within that folder create a `template.liquid` file which will take the same name as the directory it will live in. You may optionally create a `schema.json` file containing the section's settings, which will be appended to the Liquid template inside of `{% schema %}` tags.

### Example

```bash
./sections/article-template
├── schema.json
└── template.liquid
```

This will create an `article-template.liquid` with the contents of the `template.liquid` file and with JSON wrapped in `{% schema %}` tags, which will be copied over to the `./dist` sections folder.

## Translations

This plugin uses the [`@shopify/slate-translations` package](https://github.com/Shopify/slate/tree/master/packages/slate-translations) which enables you to separate translations into individual locale files allowing for easier maintainability for your theme's merchant-facing translations.

To learn more about structuring your translation files for your section's schema, [read the documentation](https://github.com/Shopify/slate/blob/master/packages/slate-translations/README.md).
