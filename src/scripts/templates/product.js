window.theme = window.theme || {};

/**
 * Product Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Product template.
 *
   * @namespace product
 */

theme.product = (function () {

  if (!theme.productSingleObject) { return }

  var cache = {
    $addToCart: $('#AddToCart'),
    $productPrice: $('#ProductPrice'),
    $comparePrice: $('#ComparePrice'),
    $addToCartText: $('#AddToCartText'),
    $productFeaturedImage: $('#ProductPhotoImg'),
    $productThumbs: $('#ProductThumbs').find('.product-single__thumbnail')
  };

  Shopify.Image.preload(theme.productSingleObject.images, 'large');

  new Shopify.OptionSelectors('ProductSelect', {
    product: theme.productSingleObject,
    onVariantSelected: self.updateVarientSelection,
    enableHistoryState: true
  });

  // Clean up variant labels if the Shopify-defined
  // defaults are the only ones left
  self.simplifyVariantLabels(theme.productSingleObject);

  /**
   * Updates the product page once a varient is selected. Changes button
   * status, text feedback, varient image, and prices.
   *
   * @param {Object} variant - Product object
   */
  function updateVarientSelection(variant) {
    // Update cart button and text status
    if (!variant) {
      updateAddToCartState(false, theme.strings.unavailable);
      return;
    }

    if (variant.available) {
      updateAddToCartState(true, theme.strings.addToCart);
    } else {
      updateAddToCartState(false, theme.strings.soldOut);
    }

    // Update variant image, if one is set
    if (variant.featured_image) {
      updateProductImage(variant.featured_image.src);
    }

    // Update the product prices
    updateProductPrices(variant.price, variant.compare_at_price)
  }

  /**
   * Updates the DOM state of the cart
   *
   * @param {boolean} enabeled - Decides whether cart is enabled or disabled
   * @param {string} text - Updates the text notification content of the cart
   */
  function updateAddToCartState(enabeled, text) {
    cache.$addToCart.prop('disabled', !enabeled);
    cache.$addToCartText.html(text);
  }

  /**
   * Updates the DOM with specified prices
   *
   * @param {string} productPrice - The current price of the product
   * @param {string} comparePrice - The original price of the product
   */
  function updateProductPrices(productPrice, comparePrice) {
    cache.$productPrice
      .html(Shopify.formatMoney(productPrice, theme.moneyFormat));

    if (comparePrice > productPrice) {
      cache.$comparePrice
        .html(Shopify.formatMoney(comparePrice, theme.moneyFormat))
        .removeClass('hide');
    } else {
      cache.$comparePrice
        .addClass('hide');
    }
  }

  /**
   *  Adjust option_selection.js labels based on variant default values
   */
  function simplifyVariantLabels(product) {
    // option_selection.js does not add a label if there is only one variant
    // option. Add one as long as it is not 'Title' (Shopify's default), add
    // one.
    if (product.options.length === 1 && product.options[0] !== 'Title') {
      $('.selector-wrapper:eq(0)').prepend('<label for="ProductSelect-option-0">'+ product.options[0] +'</label>');
    }

    // Hide variant dropdown if only one exists and title contains 'Default'
    if (product.variants.length && product.variants[0].title.indexOf('Default') >= 0) {
      $('.selector-wrapper').hide();
    }
  }

  /**
   * Updates the DOM with the specified image URL
   *
   * @param {string} src - Image src URL
   */
  function updateProductImage(src) {
    var size = Shopify.Image.imageSize(cache.$productFeaturedImage.attr('src'));
    var sizedImgUrl = Shopify.Image.getSizedImageUrl(src, size);

    $('#ProductPhotoImg').attr('src', sizedImgUrl);
  }
})();
