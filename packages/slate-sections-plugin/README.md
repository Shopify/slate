# @shopify/slate-sections-plugin

The plugin allows developers to create Shopify theme sections from a variety of files contained in a folder, and combines these files into a single liquid section file for use on Shopify servers.

## How to use

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
  plugins: [new SlateSectionsPlugin({slateSectionsOptions})],
};
```

## Options

| Option              | Required? | Type   | Default           | Description                                                                                                                                                       |
| ------------------- | --------- | ------ | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| from                | Yes       | String | undefined         | The absolute path to the folder containing your sections, typically ./src/sections                                                                                |
| to                  | Yes       | String | undefined         | The absolute path to the folder where your sections will be outputted to, typically ./dist/sections                                                               |
| genericTemplateName | No        | String | 'template.liquid' | If you're using the 'Sections as Folders' structure, your template names by default need to be 'template.liquid'. You may change this value if you would like to. |

## Sections as Liquid Files

You may structure your sections folder such that it exists of simply liquid templates which will get copied into the build.

```bash
./sections
├── blog-posts.liquid
├── collection-list.liquid
├── featured-collection.liquid
├── featured-product.liquid
├── footer.json
├── footer.liquid
├── header.liquid
├── image-with-text.liquid
├── newsletter.liquid
├── product.liquid
└── rich-text.liquid
```

This structure simply tells the plugin to copy the liquid files into the dist sections folder

## Sections as Folders

You may separate your schema from your liquid by creating a folder for your section. This increases maintainability and provides syntax highlighting on your json objects.

In order to have separate schema files, you must create a folder for the section and within that folder you need a `template.liquid` which will take the name of the directory it is in, and you may optionally have a `schema.json` file with contents that will be appended to the liquid in `{% schema %}` tags.

### Example

```bash
./sections/article-template
├── schema.json
└── template.liquid
```

This will create an `article-template.liquid` with the contents of the `template.liquid` file and with json wrapped in `{% schema %}` tags, which will be outputted to the sections dist folder.

## Translations

If you need settings in your schema that require multiple translations, you could specify that by doing as such

```json
{
  "name": {
    "de": "Posts",
    "en": "Posts",
    "es": "Publicaciones",
    "fr": "Articles",
    "it": "Articoli",
    "ja": "投稿",
    "pt-BR": "posts"
  },
  "settings": [
    {
      "type": "checkbox",
      "id": "image_parallax",
      "label": {
        "de": "Parallax-Animation für Bild anzeigen",
        "en": "Show image parallax animation",
        "es": "Mostrar animación de paralaje de imagen",
        "fr": "Afficher l'animation en parallaxe",
        "it": "Mostra animazione parallasse immagine",
        "ja": "画像のパララックスアニメーションを表示する",
        "pt-BR": "Exibir animação de paralaxe da imagem"
      }
    }
  ]
}
```

However as the number of languages add up for your theme, and when you have many settings that require translations, this can result in a very large json file that becomes difficult to maintain. This plugin allows you to seperate the translations into different files increasing the maintainability of your project.

First you specify your main schema (`schema.json`) as such,

```json
{
  "name": {
    "t": "name"
  },
  "settings": [
    {
      "type": "checkbox",
      "id": "image_parallax",
      "label": {
        "t": "settings.image_parallax.label"
      }
    }
  ]
}
```

For every key with multiple translations you specify an object with a `t` key and its value is the key to retrieve the translation from a different json object as the one shown below. You would have a translation object such as the one below for every language you would like to support.

```json
{
  "name": "Posts",
  "settings": {
    "image_parallax": {
      "label": "Show image parallax animation",
      "info": "Only shows on desktop"
    }
  }
}
```

The plugin will take care of combining all the translations into an object such as the one displayed initially. To specify the locale code of your json file, you must name it [`localecode`].json

Below is an example of what your section's folder may look like:

```json
./sections/article-template
├── locales
│   ├── de.json
│   ├── en.json
│   ├── es.json
│   ├── fr.json
│   ├── it.json
│   ├── ja.json
│   └── pt-BR.json
├── schema.json
└── template.liquid
```

This will all get combined and outputted into a single `article-template.liquid`
