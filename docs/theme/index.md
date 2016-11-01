---
layout: default
---
# Theme files

Slate is two separate parts. First, it's a barebones theme to develop your own styles and layouts on. Second, it's a toolkit of useful tasks to sync with your local files to your live store. [Learn more about the tasks here](/slate/tasks).

## Templates and configuration

All configuration files, layouts, and liquid templates required if you are submitting your theme to the Theme Store are included. See the [full guidelines for submission here](https://help.shopify.com/themes/development/theme-store-requirements?ref=slate-docs).

Standard liquid tags and logic that are likely to be used on a given template have been included with little to no markup, classes, or other code that you will need to strip out.

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

> See how the JavaScript for sections and theme editor events is setup here (TO DO: ADD LINK).

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
- CSS Wizardry grid (modified). Examples (TO DO: add link)
  - There are no grid classes in the templates so you can easily switch to your preferred method
- Responsive tables. Examples (TO DO: add link)
- SVG icon style helpers. Examples (TO DO: you get the idea...)
- `.btn` class with smart defaults
- Form elements with default, disabled, error, and focus states ready to be styled
- Blank state SVG styles (TO DO: add example link)

### Sass mixins

A few helpful Sass mixins are included in Slate to make responsive, cross-browser, and accessibility development easier.

- Prefixes. Example. (TO DO.. link)
- Media query mixin for consistent breakpoint styles
- Responsive helpers to show/hide content and align text based on breakpoint names. Example (TO DO. link)
- Visually hide or show content for screen reader accessibility


## JavaScript helpers

** TO DO: clean this up, explain more, link to examples **

- Accessibility helpers (more info link)
- Force tables and videos to be responsive
- Easy handling of theme editor events (load, select, deselect or sections and their content) (need demo/example of this)
- Format money in JS the same as Liquid allows
- Helpers for handling images in JS, including getting size based on URL and preloading sets of images
- Listen for product variant option changes and setup scaffolding for handling result
  - This is a replacement for `option_selection.js` that uses Liquid to generate the multiple variant `select` or `radio` markup

## i18n strings

i18n is shorthand for internationalization. Slate ships with six languages — English, French (Canadian), Spanish, German, and two dialects of Portuguese (Brazilian and European). These strings can be found in the `locales` folder.
