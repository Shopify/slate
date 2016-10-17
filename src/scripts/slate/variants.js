slate.Variants = (function() {
  function Variants(options) {
    this.$container = options.$container;
    this.product = options.product;
    this.selectors = options.selectors;
    this.settings = options.settings;

    var options = this._getCurrentOptions();
    this.currentVariant = this._getVariantFromOptions(options);

    $(this.selectors.singleOptionSelector).on('change', this._onSelectChange.bind(this));
  }

  Variants.prototype = _.assignIn({}, Variants.prototype, {
    _getCurrentOptions: function() {
      var options = _.map($(this.selectors.singleOptionSelector, this.$container), function(element) {
        var $element = $(element);
        var type = $element.attr('type');

        if (type === 'radio' || type === 'checkbox') {
          if ($element[0].checked) {
            return $element.val();
          } else {
            return false;
          }
        } else {
          return $element.val();
        }
      });

      options = _.filter(options);

      return options;
    },

    _getVariantFromOptions: function(selectedValues) {
      var variants = this.product.variants;

      var found = _.find(variants, function(variant) {
        return selectedValues.every(function(value) {
          return (variant.options.indexOf(value) !== -1);
        });
      });

      return found;
    },

    _onSelectChange: function() {
      var options = this._getCurrentOptions();
      var variant = this._getVariantFromOptions(options);

      this.$container.trigger({
        type: 'variantChange',
        variant: variant
      });

      if (!variant) {
        return;
      }

      this._updateMasterSelect(variant);
      this._updateImages(variant);
      this._updatePrice(variant);
      this.currentVariant = variant;

      if (this.settings.enableHistoryState) {
        this._updateHistoryState(variant);
      }
    },

    _updateImages: function(variant) {
      var variantImage = variant.featured_image || {};
      var currentVariantImage = this.currentVariant.featured_image || {};

      if (!variant.featured_image || variantImage.src === currentVariantImage.src) {
        return;
      }

      this.$container.trigger({
        type: 'variantImageChange',
        variant: variant
      });
    },

    _updatePrice: function(variant) {
      if (variant.price === this.currentVariant.price && variant.compare_at_price === this.currentVariant.compare_at_price) {
        return;
      }

      this.$container.trigger({
        type: 'variantPriceChange',
        variant: variant
      });
    },

    _updateHistoryState: function(variant) {
      if (!history.pushState || !variant) {
        return;
      }

      var newurl = window.location.protocol + '//' + window.location.host + window.location.pathname + '?variant=' + variant.id;
      window.history.replaceState({path: newurl}, '', newurl);
    },

    _updateMasterSelect: function(variant) {
      var $originalSelector = $(this.selectors.originalSelectorId);

      if (!variant) {
        return;
      }

      $originalSelector.find('[selected]').removeAttr('selected');
      $originalSelector.find('[value=' + variant.id + ']').attr('selected', 'selected');
    }
  });

  return Variants;
})();
