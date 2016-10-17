/**
 * Product Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Product template.
 *
   * @namespace product
 */

theme.Product = (function() {

  /**
   * Product section constructor.  Runs on page load as well as Theme Editor
   * `section:load` events.
   * @param {string} container - selector for the section container DOM element
   */
  function Product(container) {
    var $container = this.$container = $(container);

    this.settings = {
      enableHistoryState: $container.data('enable-history-state'),
      eventNamespace: '.product'
    };

    this.selectors = {
      addToCart: '#AddToCart',
      productPrice: '#ProductPrice',
      comparePrice: '#ComparePrice',
      addToCartText: '#AddToCartText',
      productFeaturedImage: '#ProductPhotoImg',
      productThumbs: '#ProductThumbs .product-single__thumbnail',
      originalSelectorId: '#ProductSelect',
      singleOptionSelector: '.single-option-selector'
    };

    // Stop parsing if we don't have the product json script tag when loading
    // section in the Theme Editor
    if (!$('#ProductJson').html()) {
      return;
    }
    this.productSingleObject = JSON.parse(document.getElementById('ProductJson').innerHTML);
    this.settings.imageSize = slate.Image.imageSize($(this.selectors.productFeaturedImage).attr('src'));

    slate.Image.preload(this.productSingleObject.images, this.settings.imageSize);

    this.initVariants();
  }

  Product.prototype = _.assignIn({}, Product.prototype, {

    /**
     * Handles change events from the variant inputs
     */
    initVariants: function() {
      var options = {
        $container: this.$container,
        settings: this.settings,
        selectors: this.selectors,
        product: this.productSingleObject
      };

      // eslint-disable-next-line no-new
      this.variants = new slate.Variants(options);

      this.$container.on('variantChange' + this.settings.eventNamespace, this.updateVariantSelection.bind(this));


      // Clean up variant labels if the Shopify-defined
      // defaults are the only ones left
      this.simplifyVariantLabels(this.productSingleObject);
    },

    /**
     * Updates the product page once a varient is selected. Changes button
     * status, text feedback, varient image, and prices.
     *
     * @param {Object} evt - variantChange event from Variant.js
     */
    updateVariantSelection: function(evt) {
      var variant = evt.variant;
      console.log(variant);
      // Update cart button and text status
      if (!variant) {
        this.updateAddToCartState(false, theme.strings.unavailable);
        return;
      }

      if (variant.available) {
        this.updateAddToCartState(true, theme.strings.addToCart);
      } else {
        this.updateAddToCartState(false, theme.strings.soldOut);
      }

      // Update variant image, if one is set
      if (variant.featured_image) {
        this.updateProductImage(variant.featured_image.src);
      }

      // Update the product prices
      this.updateProductPrices(variant.price, variant.compare_at_price);
    },

    /**
     * Updates the DOM state of the cart
     *
     * @param {boolean} enabeled - Decides whether cart is enabled or disabled
     * @param {string} text - Updates the text notification content of the cart
     */
    updateAddToCartState: function(enabeled, text) {
      $(this.selectors.addToCart).prop('disabled', !enabeled);
      $(this.selectors.addToCartText).html(text);
    },

    /**
     * Updates the DOM with specified prices
     *
     * @param {string} productPrice - The current price of the product
     * @param {string} comparePrice - The original price of the product
     */
    updateProductPrices: function(productPrice, comparePrice) {
      $(this.selectors.productPrice)
        .html(slate.Currency.formatMoney(productPrice, theme.moneyFormat));

      if (comparePrice > productPrice) {
        $(this.selectors.comparePrice)
          .html(slate.Currency.formatMoney(comparePrice, theme.moneyFormat))
          .removeClass('hide');
      } else {
        $(this.selectors.comparePrice)
          .addClass('hide');
      }
    },

    /**
     * Adjust product form labels based on variant default values to improve on
     * Shopify defaults
     *
     * @param {object} product - Product object
     */
    simplifyVariantLabels: function(product) {
      if (product.options.length === 1 && product.options[0] !== 'Title') {
        $('.selector-wrapper:eq(0)').prepend('<label for="ProductSelect-option-0">' + product.options[0] + '</label>');
      }
    },

    /**
     * Updates the DOM with the specified image URL
     *
     * @param {string} src - Image src URL
     */
    updateProductImage: function(src) {
      var sizedImgUrl = slate.Image.getSizedImageUrl(src, this.settings.imageSize);

      $(this.selectors.productFeaturedImage).attr('src', sizedImgUrl);
    },

    /**
     * Event callback for Theme Editor `section:unload` event
     */
    onUnload: function() {
      this.$container.off(this.settings.eventNamespace);
    }
  });

  return Product;
})();
