---
layout: default
---
# What's included

Slate is two separate parts. First, it's a barebones theme to develop your own styles and layouts on. Second, it's a toolkit of useful commands to sync with your local files to your live store. [Learn more about the commands here](/slate/commands).

## Templates and configuration

All configuration files, layouts, and liquid templates required for Theme Store submissions are included. See the [full guidelines for submission here](https://help.shopify.com/themes/development/theme-store-requirements?ref=slate-docs).

```
config/
  - settings_data.json
  - settings_schema.json
layout/
  - gift_card
  - password
  - theme
templates/
  - 404
  - article
  - blog
  - cart
  - collection
  - gift_card
  - index
  - page.contact
  - page
  - password
  - product
  - search
  customers/
    - account
    - activate_account
    - addresses
    - login
    - order
    - register
    - reset_password
```

Also included is a **Styles** template (`page.styles.liquid`). This is available to help you visualize your site's layout and styles with dummy content that is common across themes. Remove this template before shipping your theme.

### Intentionally blank

Standard liquid tags and logic likely to be used on a given template have been included with little to no markup, classes, or other code that you will need to strip out. Below is an image of what Slate looks like out of the box.

<img src="{{ "/assets/images/fresh-install.jpg" | prepend: site.baseurl }}" alt="Slate on a fresh install" class="demo-image">

## Sections

Sections are a new way of letting merchants control their own layout and appearance in their themes. Read more about [their introduction here](https://www.shopify.com/partners/blog/introducing-sections-for-shopify-themes) and the [full docs here](https://help.shopify.com/themes/development/theme-editor/sections). Slate includes two types of sections.

### Static sections

Statically-included sections allow for in-context settings when that section is visible in the theme editor.

For example, the product section is included with `{% raw %}{% section 'product' %}{% endraw %}` in `templates/product.liquid`. Any settings defined in the product section will be visible when a merchant visits the product page.

```
sections/
  - header
  - footer
  - product
```

### Dynamic sections

Dynamic sections allow merchants to add, edit, and reorder content on their home page. It is highly recommended to read the [sections development documentation](https://help.shopify.com/themes/development/theme-editor/sections) to understand how limitless the possibilities are. Slate provides three common dynamic sections to act as a starting reference.

```
sections/
  - collection-list
  - featured-collection
  - featured-product
```

## Sass scaffolding and helpers

**Slate is not a CSS framework.** Instead it sets you up to start styling your own way quickly with a reset and some helper scaffolding.

### Normalize and reset

A blank starting point is included with [Normalize.css](https://necolas.github.io/normalize.css/) and other helper styles that Shopify's internal themes team has consistently relied on.

* Prevent zooming when inputs are focused on mobile (min 16px font size)
* Prevent unexpected styles on focused elements
* IE `<select>` and `<option>` style fixes
* Improve text rendering on some WebKit form fields
* Use `touch-action: manipulation` to enable fast tapping
* Responsive tables and video iframes added by a rich text editor (by adding wrapping classes in JS)

### Scaffolding

Starting a fresh project should not include reinventing the wheel. Slate offers some starting structure to your project that you can choose to use or not.

- Map shop settings to Sass variables
- CSS grid. [Example]({{ '/css-examples/#grid' | prepend: site.baseurl }})
  - There are no grid classes in the templates so you can easily switch to your preferred grid
- SVG icon style helpers. [Example]({{ '/css-examples/#svg-icons' | prepend: site.baseurl }})
- Responsive tables. [Example]({{ '/css-examples/#responsive-tables' | prepend: site.baseurl }})
- `.btn` class with smart defaults. [Source](https://github.com/Shopify/slate/blob/master/src/styles/global/links-buttons.scss)
- Form elements with default, disabled, error, and focus states ready to be styled. [Source](https://github.com/Shopify/slate/blob/master/src/styles/global/forms.scss)
- Blank state SVG styles [Example]({{ '/css-examples/#blank-states' | prepend: site.baseurl }})

### Sass mixins

A few helpful Sass mixins are included in Slate to make responsive, cross-browser, and accessibility development easier.

- Media query mixin for consistent breakpoint styles. [Example]({{ '/css-examples/#media-query-mixin' | prepend: site.baseurl }})
- Responsive helpers to show/hide content and align text based on breakpoint names. [Example]({{ '/css-examples/#visibility-per-breakpoint' | prepend: site.baseurl }})
- Prefixes. [Example]({{ '/css-examples/#' | prepend: site.baseurl }})
- Visually hide or show content for screen reader accessibility. [Example]({{ '/css-examples/#visually-hide' | prepend: site.baseurl }})


## JavaScript helpers

- Accessibility helpers. [Example]({{ '/js-examples/#trap-focus' | prepend: site.baseurl }}). [Source](https://github.com/Shopify/slate/blob/master/src/scripts/slate/a11y.js).
- Force tables and videos to be responsive. [Example]({{ '/js-examples/#responsive-tables-and-videos' | prepend: site.baseurl }})
- Easy handling of theme editor events (load, select, deselect or sections and their content) (need demo/example of this)
- Format currency in JS the same as Liquid allows. [Example]({{ '/js-examples/#format-currency' | prepend: site.baseurl }})
- Helpers for handling images in JS, including getting size based on URL and preloading sets of images. [Examples]({{ '/js-examples/#image-helpers' | prepend: site.baseurl }})
- Listen for product variant option changes and setup scaffolding for handling result. [Example]({{ '/js-examples/#product-variants' | prepend: site.baseurl }})

## i18n strings

i18n is shorthand for internationalization. Slate ships with six languages — English, French (Canadian), Spanish, German, and two dialects of Portuguese (Brazilian and European). These strings can be found in the `locales` folder. [Learn more about translating your themes here](https://help.shopify.com/manual/sell-online/online-store/translate-theme).
