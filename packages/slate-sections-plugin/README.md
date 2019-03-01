# @shopify/slate-sections-plugin

Handles exporting the source sections folder to the dist path. There are 3 supported sections folder structures. You may structure your sections folder such that it exists of simply liquid templates which will get copied into the build. You may separate your schema from your liquid by creating a folder for your section, and to build on this you may further separate your translations into a locales folder. The structures are explained in more depth further below.

The dist and source path for the plugin is determined by the slate config and can be overwritten by modifying the config values `paths.theme.src.sections` and `paths.theme.dist.sections`

## Basic Sections Structure

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

## Separate Schema Files

In order to have separate schema files, you must create a folder for the section and within that folder you need a `template.liquid` which will take the name of the directory it is in, and you may optionally have a `schema.json` file with contents that will be appended to the liquid in `{% schema %}` tags.

### Example

```bash
./sections/article-template
├── schema.json
└── template.liquid
```

This will create an `article-template.liquid` with the contents of the `template.liquid` file and with json wrapped in `{% schema %}` tags, which will be outputted to the sections dist folder.

## Translations

Suppose you have values in your schema that require multiple translations, you could specify that by doing as such

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

However as the number of languages add up for your theme, and when you have many values that require translations, this can result in a very large json file that becomes difficult to maintain. This plugin allows you to seperate the translations into different files increasing the maintainability of your project.

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

This allows you to have multiple languages to support, without having a single schema.json that gets ridiculously large. The plugin will take care of combining all the translations into an object such as the one displayed initially. To specify the locale code of your json file, you must name it as such [`localecode`].json

Below is an example of what your section's folder may look like.

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
