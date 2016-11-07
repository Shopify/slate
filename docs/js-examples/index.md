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
  <iframe width="100%" height="233" src="../js-examples/trap-focus" frameborder="0"></iframe>
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
  <iframe width="100%" height="815" src="../js-examples/tables-videos" frameborder="0"></iframe>
</div>

## Format currency

Slate ships JavaScript to mimic [Shopify money formats](https://help.shopify.com/manual/payment-settings/currency-formatting#currency-formatting-options). This makes handling product prices and cart items in JS simple. ([View currency.js source](https://github.com/Shopify/slate/blob/master/src/scripts/slate/currency.js)).

Slate maps the shop's money format — defined in Liquid — to a JavaScript variable in `layouts/theme.liquid` so it can be used regardless of file type.

In layouts/theme.liquid:
```
window.theme.moneyFormat: {% raw %}{{ shop.money_format | json }}{% endraw %};
```

In this example, `shop.money_format` is {% raw %}`${{amount}}`{% endraw %} so 1999 cents would be formatted as $19.99.
```
var itemPrice = 1999; // cents
slate.Currency.formatMoney(itemPrice, theme.moneyFormat);

Output:
$19.99
```

## Image helpers

