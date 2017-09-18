---
layout: default
---
# JS examples

## Trap focus

It's important to consider keyboard users when using dynamic modules, such as a modal or popover. If they take over the full screen then it's best to limit the user's keyboard access to that module so they don't end up tabbing through hidden elements on the page.

Here's an example of a modal that traps the keyboard focus inside the element when open, and removes the trap when closed.

```
slate.a11y.trapFocus({ options });
slate.a11y.removeTrapFocus({ options });
```

| Parameters         | Type          | Description   |
| :----------------- | :------------ | :------------ |
| `$container`       | jQuery object | Container to trap focus within |
| `namespace`        | string        | Namespace used for new focus event handler |
| `$elementToFocus`  | jQuery object (optional) | Set an element to be selected after the focus is trapped. Only used in `trapFocus`. |

```
var $modal = $('#Modal');

$('#TriggerModal').on('click', function() {
  $modal.addClass('is-active');

  slate.a11y.trapFocus({
    $container: $modal,
    namespace: 'modal',
    $elementToFocus: $modal.find('input[type="text"]')
  });
});

$('#CloseModal').on('click', function() {
  $modal.removeClass('is-active');

  slate.a11y.removeTrapFocus({
    $container: $modal,
    namespace: 'modal'
  });
});
```

<div class="demo-iframe">
  {% include iframe-toggles.html %}
  <iframe width="100%" height="233" src="{{ site.baseurl }}/js-examples/trap-focus/" frameborder="0"></iframe>
</div>

## Responsive tables and videos

Tables and video embeds do not natively scale well on smaller screens. Slate adds a wrapper class to tables and video embeds that are loaded in from a rich text editor.

| Parameters           | Type          | Description   |
| :------------------- | :------------ | :------------ |
| `$tables`            | jQuery object | `<table>` elements to be made responsive |
| `tableWrapperClass`  | string        | CSS class to apply on the `<div>` that will wrap each targeted `<table>` element |
| `$iframes`           | jQuery object | `<iframe>` elements to be made responsive |
| `iframeWrapperClass` | string        | CSS class to apply on the `<div>` that will wrap each targeted `<iframe>` element |

```
// Wrap RTE tables to make them scrollable
var tableSelectors = '.rte table';

slate.rte.wrapTable({
  $tables: $(tableSelectors),
  tableWrapperClass: 'rte__table-wrapper',
});

// Wrap RTE videos to make them responsive
var videoSelectors =
  '.rte iframe[src*="youtube.com/embed"],' +
  '.rte iframe[src*="player.vimeo"]';

slate.rte.wrapIframe({
  $iframes: $(videoSelectors),
  iframeWrapperClass: 'rte__video-wrapper'
});
```

<div class="demo-iframe">
  {% include iframe-toggles.html %}
  <iframe width="100%" height="815" src="{{ site.baseurl }}/js-examples/tables-videos/" frameborder="0"></iframe>
</div>

## Format currency

Slate ships JavaScript to mimic [Shopify money formats](https://help.shopify.com/manual/payment-settings/currency-formatting#currency-formatting-options). This makes handling product prices and cart items in JS simple. ([View currency.js source](https://github.com/Shopify/slate/blob/master/packages/slate-theme/src/scripts/slate/currency.js)).

Slate maps the shop's money format — defined in Liquid — to a JavaScript variable in `layouts/theme.liquid` so it can be used regardless of file type.

In layouts/theme.liquid:

```
window.theme.moneyFormat: {% raw %}{{ shop.money_format | json }}{% endraw %};
```

| Parameters      | Type            | Description    |
| :-------------- | :-------------- | :------------- |
| `cents`         | string          | Price in cents |
| `format`        | string          | shop.money_format setting |

In this example, `shop.money_format` is {% raw %}`${{amount}}`{% endraw %} so 1999 cents would be formatted as $19.99.

```
var itemPrice = 1999; // cents
slate.Currency.formatMoney(itemPrice, theme.moneyFormat);

// Returns string
'$19.99'
```

## Image helpers

| Command | Usage |
| :------ | :---- |
| [preload](#preload) | `slate.Images.preload(images, size)` |
| [imageSize](#imagesize) | `slate.Images.imageSize(src)` |
| [getSizedImageUrl](#getsizedimageurl) | `slate.Images.getSizedImageUrl(src, size)` |
| [removeProtocol](#removeprotocol) | `slate.Images.removeProtocol(path)` |

### preload

Preload a single image or an array of images at a given size. A common use for preloading is reducing the loading delay when enlarging a thumbnail.

| Parameters         | Type            | Description   |
| :----------------- | :-------------- | :------------ |
| `images`           | array or string | Single image URL or list of image URLs |
| `size`             | string          | Size of image to request |

```
slate.Image.preload(['image-url-1.jpg', 'image-url-2.jpg'], '1024x1024');
```

### imageSize

Get the size of an image based on the URL.

| Parameters      | Type            | Description   |
| :-------------- | :-------------- | :------------ |
| `src`           | string          | Image URL     |

```
slate.Image.imageSize('https://cdn.shopify.com/s/files/big-ol-image_480x480.jpeg');

// Returns string
'480x480'
```

### getSizedImageUrl

Adds a Shopify size attribute to a URL

| Parameters      | Type            | Description   |
| :-------------- | :-------------- | :------------ |
| `src`           | string          | Image URL     |
| `size`          | string          | Custom size   |

```
slate.Image.getSizedImageUrl('https://cdn.shopify.com/s/files/big-ol-image.jpeg', '250x250');

// Returns string
'https://cdn.shopify.com/s/files/big-ol-image_250x250.jpeg'
```

### removeProtocol

| Parameters      | Type            | Description   |
| :-------------- | :-------------- | :------------ |
| `path`          | string          | Image URL     |

```
slate.Image.removeProtocol('https://cdn.shopify.com/s/files/big-ol-image_480x480.jpeg')

// Returns string
'//cdn.shopify.com/s/files/big-ol-image_480x480.jpeg'
```

## Product variants

The Slate theme has two script files to manage the display of product variants:

| Script      | Location            | Description   |
| :-------------- | :-------------- | :------------ |
| [variant.js](#variantjs)    | `scripts/slate`       | Handles variant change events in any forms that add to cart    |
| [product.js](#productjs)    | `scripts/sections`    | Behaviour coupled to the theme code of product-based sections     |

### variant.js

Slate separates product variant options into multiple `<select>` elements.  When a variant changes, `variant.js` updates the *master select*.  The master select is the default `<select>` element that contains all variant IDs needed to properly submit the form.

Slate's `variant.js` also triggers a number of custom events to handle various state changes:

| Events      | Trigger condition |
| :-------------- | :-------------- |
| `variantChange`        | When a variant option's `<select>` element is changed. |
| `variantImageChange`          | When the selected variant has a featured image which is not currently displayed. |
| `variantPriceChange`         | When the selected variant has a price or compare_at_price which is different than what is currently displayed. |

### product.js

The theme-specific script of `product.js` has a number of methods that listen for the above custom events.  Each function has access to the newly selected variant object in `evt.variant`.  Customize these functions to fit your theme's desired behaviour.

| Methods      | Description |
| :-------------- | :-------------- |
| `updateAddToCartState()`        | Update the add to cart button text and enabled/disabled/sold out state |
| `updateProductImage()`          | Replace the main product image `src` with the associated variant image if it exists |
| `updateProductPrices()`         | Updates the product price and compare_at_price when necessary |

## Cart helpers

In order for customers to build a cart, their browsers must support cookies.

| Methods      | Description |
| :-------------- | :-------------- |
| `cookiesEnabled()`        | Returns `true` if the browser supports cookies. |

In the theme scaffolding, classes for `supports-cookies` and `supports-no-cookies` are toggled on the `html` element so theme developers can show/hide different content based on browser support.

```
if (slate.cart.cookiesEnabled()) {
  document.documentElement.className = document.documentElement.className.replace('supports-no-cookies', 'supports-cookies');
}
```

## Section events

Slate comes with a `section.js` file to help Sections communicate with Shopify's [Theme editor JavaScript API](https://help.shopify.com/themes/development/theme-editor/sections#theme-editor-javascript-api).

| Methods      | Description |
| :-------------- | :-------------- |
| `onUnload()`        | A section has been deleted or is being re-rendered. |
| `onSelect()`        | User has selected the section in the editor's sidebar. |
| `onDeselect()`          | User has deselected the section in the editor's sidebar. |
| `onReorder()`          | User has changed the section's order in the editor's sidebar. |
| `onBlockSelect()`        | User has selected the block in the editor's sidebar. |
| `onBlockDeselect()`        | User has deselected the block in the editor's sidebar. |

As an example, `product.js` uses the `onUnload` method to remove all namespaced events when the section is deleted or re-rendered.

```
Product.prototype = $.extend({}, Product.prototype, {
  onUnload: function() {
    this.$container.off(this.settings.eventNamespace);
  }
});
```

### Register sections

Slate provides a `register` method to properly scope the various Sections used in a theme.

```
sections.register(type, constructor);
```

| Parameters      | Type            | Description    |
| :-------------- | :-------------- | :------------- |
| `type`         | string          | Unique section type defined by theme developer |
| `constructor`        | function          | Section constructor run in Theme editor and on storefront |

Slate follows a convention of wrapping the content of a Section file in an element with a `data-section-type` attribute.  The `type` is taken from this attribute's value.

{% raw %}
```
// From sections/product.liquid
<div data-section-id="{{ section.id }}" data-section-type="product">
  ...
</div>
```
{% endraw %}

In the `theme.js` file, you must import the Section specific JavaScript with the `// =require` helper, [more information here](https://www.npmjs.com/package/gulp-include), as it will contain your `constructor`.

```
// =require sections/product.js

$(document).ready(function() {
  var sections = new slate.Sections();
  sections.register('product', theme.Product);
});
```
