/**
 * Product Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Product template.
 *
   * @namespace product
 */

theme.Product = (function() {

  var selectors = {
    addToCart: '.add-to-cart',
    addToCartText: '.add-to-cart-text',
    comparePrice: '.compare-price',
    originalSelectorId: '.product-select',
    priceWrapper: '.price-wrapper',
    productFeaturedImage: '.product-image',
    productJson: '.product-json',
    productPrice: '.product-price',
    productThumbs: '.product-single-thumbnail',
    singleOptionSelector: '.single-option-selector'
  };

  /**
   * Product section constructor. Runs on page load as well as Theme Editor
   * `section:load` events.
   * @param {string} container - selector for the section container DOM element
   */
  function Product(container) {
    this.$container = $(container);
    var sectionId = this.$container.attr('data-section-id');

    // Stop parsing if we don't have the product json script tag when loading
    // section in the Theme Editor
    if (!$(selectors.productJson, this.$container).html()) {
      return;
    }
    this.productSingleObject = JSON.parse($(selectors.productJson, this.$container).html());

    this.settings = {
      eventNamespace: '.product',
      imageSize: slate.Image.imageSize($(selectors.productFeaturedImage, this.$container).attr('src'))
    };

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
        enableHistoryState: this.$container.data('enable-history-state') || false,
        singleOptionSelector: selectors.singleOptionSelector,
        originalSelectorId: selectors.originalSelectorId,
        product: this.productSingleObject
      };

      // eslint-disable-next-line no-new
      this.variants = new slate.Variants(options);

      this.$container.on('variantChange' + this.settings.eventNamespace, this.updateAddToCartState.bind(this));
      this.$container.on('variantImageChange' + this.settings.eventNamespace, this.updateProductImage.bind(this));
      this.$container.on('variantPriceChange' + this.settings.eventNamespace, this.updateProductPrices.bind(this));
    },

    /**
     * Updates the DOM state of the add to cart button
     *
     * @param {boolean} enabeled - Decides whether cart is enabled or disabled
     * @param {string} text - Updates the text notification content of the cart
     */
    updateAddToCartState: function(evt) {
      var variant = evt.variant;

      if (variant) {
        $(selectors.priceWrapper, this.$container).removeClass('hide');
      } else {
        $(selectors.addToCart, this.$container).prop('disabled', true);
        $(selectors.addToCartText, this.$container).html(theme.strings.unavailable);
        $(selectors.priceWrapper, this.$container).addClass('hide');
        return;
      }

      if (variant.available) {
        $(selectors.addToCart, this.$container).prop('disabled', false);
        $(selectors.addToCartText, this.$container).html(theme.strings.addToCart);
      } else {
        $(selectors.addToCart, this.$container).prop('disabled', true);
        $(selectors.addToCartText, this.$container).html(theme.strings.soldOut);
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

      $(selectors.productPrice, this.$container)
        .html(slate.Currency.formatMoney(variant.price, theme.moneyFormat));

      if (variant.compare_at_price > variant.price) {
        $(selectors.comparePrice, this.$container)
          .html(slate.Currency.formatMoney(variant.compare_at_price, theme.moneyFormat))
          .removeClass('hide');
      } else {
        $(selectors.comparePrice, this.$container).addClass('hide');
      }
    },

    /**
     * Updates the DOM with the specified image URL
     *
     * @param {string} src - Image src URL
     */
    updateProductImage: function(evt) {
      var variant = evt.variant;
      var sizedImgUrl = slate.Image.getSizedImageUrl(variant.featured_image.src, this.settings.imageSize);

      $(selectors.productFeaturedImage, this.$container).attr('src', sizedImgUrl);
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
