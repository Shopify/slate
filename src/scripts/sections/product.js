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
      enableHistoryState: _.isUndefined($container.data('enableHistoryState')) ? true : $container.data('enableHistoryState'),
      eventNamespace: '.product'
    };

    this.selectors = {
      addToCart: '#AddToCart',
      productPrice: '#ProductPrice',
      comparePrice: '#ComparePrice',
      priceWrapper: '.price-wrapper',
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
        singleOptionSelector: this.selectors.singleOptionSelector,
        originalSelectorId: this.selectors.originalSelectorId,
        product: this.productSingleObject
      };

      // eslint-disable-next-line no-new
      this.variants = new slate.Variants(options);

      this.$container.on('variantChange' + this.settings.eventNamespace, this.updateAddToCartState.bind(this));
      this.$container.on('variantImageChange' + this.settings.eventNamespace, this.updateProductImage.bind(this));
      this.$container.on('variantPriceChange' + this.settings.eventNamespace, this.updateProductPrices.bind(this));
    },

    /**
     * Updates the DOM state of the cart
     *
     * @param {boolean} enabeled - Decides whether cart is enabled or disabled
     * @param {string} text - Updates the text notification content of the cart
     */
    updateAddToCartState: function(evt) {
      var variant = evt.variant;

      if (variant) {
        $(this.selectors.priceWrapper).removeClass('hide');
      } else {
        $(this.selectors.addToCart).prop('disabled', true);
        $(this.selectors.addToCartText).html(theme.strings.unavailable);
        $(this.selectors.priceWrapper).addClass('hide');
        return;
      }

      if (variant.available) {
        $(this.selectors.addToCart).prop('disabled', false);
        $(this.selectors.addToCartText).html(theme.strings.addToCart);
      } else {
        $(this.selectors.addToCart).prop('disabled', true);
        $(this.selectors.addToCartText).html(theme.strings.soldOut);
      }
    },

    /**
     * Updates the DOM with specified prices
     *
     * @param {string} productPrice - The current price of the product
     * @param {string} comparePrice - The original price of the product
     */
    updateProductPrices: function(evt) {
      var variant = evt.variant;

      $(this.selectors.productPrice).html(slate.Currency.formatMoney(variant.price, theme.moneyFormat));

      if (variant.compare_at_price > variant.price) {
        $(this.selectors.comparePrice)
          .html(slate.Currency.formatMoney(variant.compare_at_price, theme.moneyFormat))
          .removeClass('hide');
      } else {
        $(this.selectors.comparePrice).addClass('hide');
      }
    },

    /**
     * Updates the DOM with the specified image URL
     *
     * @param {string} src - Image src URL
     */
    updateProductImage: function(evt) {
      var variant = evt.variant;
      var sizedImgUrl = slate.Image.getSizedImageUrl(variant.image.src, this.settings.imageSize);

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
