---
id: version-1.0.0-beta.14-styles-with-liquid
title: Styles with Liquid
original_id: styles-with-liquid
---

Styling Shopify themes has always been inherently more complex than a typical web project thanks to the common need to combine styling languages with Liquid. The complexity only grows worse when using compiled styling languages like Sass, since including Liquid in Sass results in invalid syntax.

## Basics of Liquid styles

Liquid is required in your styles if you want your theme to be customizable via the Online Store Editor. For example, if you wanted the background colour of your theme to be customizable, you could add a setting in your `config/settings_schema.json` and then use the value of that setting in your stylesheet. If you were using vanilla CSS, it might look something like the following:

_styles.css.liquid_

```css
body {
  background-color: {{ settings.colors.body_background }}
}
```

In order for Shopify to compute the Liquid values inside a stylesheet, you must give the stylesheet a `.liquid` extension. When a `.css.liquid` is uploaded to the assets folder of your theme on Shopify servers, the Liquid values are populated and a `.css` stylesheet is made available. For example, if you were to upload a `styles.css.liquid` file, you could include it in your theme with the following markup:

```liquid
<link type="text/css" href="{{ 'styles.css' | asset_url }}" rel="stylesheet">
```

## Liquid Sass

Similar to `css.liquid` stylesheets, if theme developers want to include Liquid directly in Sass (`.scss.liquid` files), those stylesheets need to be compiled on Shopify servers. This is because using Liquid in Sass results in invalid Sass syntax that local Sass compilers cannot parse.

Luckily for developers, Shopify has a Sass compiler built into the platform. When a `.scss.liquid` file is uploaded to the assets folder of your theme on Shopify servers, the Liquid values are populated and a `scss.css` stylesheet is made available. For example, if you were to upload a `styles.scss.liquid` file, you could include it in your theme with the following markup:

```liquid
<link type="text/css" href="{{ 'styles.scss.css' | asset_url }}" rel="stylesheet">
```

> **Note:** Shopify is using a forked version of Sass v3.2 which does not support importing partial Sass files with the `@import` directive. This may cause some issues when trying to work with 3rd party Sass libraries.

## Liquid with CSS custom properties

Slate introduces a new way of handling styles made possible through CSS custom properties. CSS custom properties are the perfect mechanism to link stylesheets to Theme Editor Liquid settings. They allow you to write valid CSS that plays well with build tools like Sass and PostCSS. CSS custom properties are also supported in all modern browsers, so there's never been a better time than now to use them!

When local Sass compilation is combined with Slate's Local Development Assets Server, style changes are instantly injected into the page, without waiting for Shopify servers, resulting in a lightning fast development experience.

To support legacy browsers, Slate includes a transpiler that replaces CSS variables with matching Liquid Variables as a last step in the production `build` script.

For an example, take a look at [`Shopify/starter-theme`](https://github.com/Shopify/starter-theme) or continue reading below:

- We define all of our CSS variables in a snippet called `css-variables.liquid` which is included in the `<head>` of the `theme.liquid` file.

- We create each variable like so, using CSS custom properties as described above:

```html
<style>
  :root {
    --color-primary: {{ settings.color_primary }};
    --color-body-text: {{ settings.color_body_text }};
    --color-main-background: {{ settings.color_main_bg }};
  }
</style>
```

- What we did here is create a CSS custom property which is tied to the value from the theme editor (that the merchant can change). We can access these variables in our `.scss` files:

```scss
$color-primary: var(--color-primary);
$color-body: var(--color-main-background);
```

- In doing so, we successfully link up the values from the Shopify Theme Editor to our `.scss` files without the need of using a `.scss.liquid` file.
