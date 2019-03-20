# @shopify/slate-translations

This plugin allows you to separate the translations into individual locale files allowing for easier maintainability for your theme's merchant-facing translations.

## Getting Started

First install the plugin

```
npm install @shopify/slate-translations --save-dev
```

or

```
yarn add @shopify/slate-translations --dev
```

## Translations

If you need settings in your schema (e.g. a section's schema or `config/settings_schema.json`) that requires multiple translations, you can specify this by doing the following:

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

However, as the number of theme languages add up over time, and when you have many settings that require translations, this can result in a very large JSON file which becomes difficult to maintain. You can avoid this by leveraging this plugin and following the steps below.

First you specify the schema's structure in `schema.json`:

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

For every key with multiple translations you specify an object with a `t` key and its value is the key to retrieve the translation from a different JSON object as the one shown below. You would have a translation object such as the one below for every language you would like to support:

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

The plugin will take care of combining all the translations into an object such as the one displayed initially. To specify the locale code of your JSON file, you must name it [`localecode`].json

Below is an example of what your section's folder may look like:

```json
./sections/header
├── locales
│   ├── de.json
│   ├── en.json
│   ├── es.json
│   ├── fr.json
│   ├── it.json
│   ├── ja.json
│   └── pt-BR.json
├── schema.json
└── template.liquid
```

This will all get combined and outputted into a single `header.liquid`.
