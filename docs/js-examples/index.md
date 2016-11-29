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
  <iframe width="100%" height="233" src="{{ site.baseurl }}/js-examples/trap-focus" frameborder="0"></iframe>
</div>

## Responsive tables and videos

Tables and video embeds do not natively scale well on smaller screens. Slate adds a wrapper class to tables and video embeds that are loaded in from a rich text editor.

```
// Wrap RTE tables
$('.rte table').wrap('<div class="rte__table-wrapper"></div>');

// Wrap RTE videos
var $iframeVideo = $('.rte iframe[src*="youtube.com/embed"], .rte iframe[src*="player.vimeo"]');
$iframeVideo.each(function() {
  $(this).wrap('<div class="rte__video-wrapper"></div>');
});
```

<div class="demo-iframe">
  {% include iframe-toggles.html %}
  <iframe width="100%" height="815" src="{{ site.baseurl }}/js-examples/tables-videos" frameborder="0"></iframe>
</div>

## Format currency

Slate ships JavaScript to mimic [Shopify money formats](https://help.shopify.com/manual/payment-settings/currency-formatting#currency-formatting-options). This makes handling product prices and cart items in JS simple. ([View currency.js source](https://github.com/Shopify/slate/blob/master/src/scripts/slate/currency.js)).

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

Slate separates product variant options into multiple `<select>` elements. Each time a new variant is selected, events are triggered to handle various state changes:

| Methods      | Description |
| :-------------- | :-------------- |
| `updateAddToCartState`        | Update the add to cart button text and enabled/disabled/sold out state |
| `updateProductImage`          | Replace the main product image `src` with the associated variant image if it exists |
| `updateProductPrices`         | Updates the product regular and sale price when necessary |

Each function has access to the newly selected variant in `evt.variant`. Customize this section as necessary to your theme.

When a variant changes, `variant.js` updated the *master select*. The master select is the default `<select>` element that contains all variant IDs needed to properly submit the form.
