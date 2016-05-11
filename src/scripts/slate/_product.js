/**
 * Shopify Product Helper Function
 * -----------------------------------------------------------------------------
 * I believe the essence of this has some value. Since we have a very specific
 * structure to our Product Object, we could have some helpful function for returning
 * specific values.
 *
 */

/**
 * Calls Product.update() with and provides a Product JSON object
 * @param json
 * @constructor
 */
slate.Product = function(json) {
  if (Shopify.isDefined(json)) { this.update(json); }
};

slate.Product.prototype.update = function(json) {
  for (property in json) {
    this[property] = json[property];
  }
};

// returns array of option names for product
slate.Product.prototype.optionNames = function() {
  if (Shopify.getClass(this.options) === 'Array') {
    return this.options;
  } else {
    return [];
  }
};

// returns array of all option values (in order) for a given option name index
slate.Product.prototype.optionValues = function(index) {
  if (!Shopify.isDefined(this.variants)) { return null; }

  var results = Shopify.map(this.variants, function(e) {
    var optionCol = 'option' + (index + 1);
    return (e[optionCol] === undefined) ? null : e[optionCol];
  });

  return (results[0] == null ? null : Shopify.uniq(results));
};

// return the variant object if exists with given values, otherwise return null
slate.Product.prototype.getVariant = function(selectedValues) {
  var found = null;
  if (selectedValues.length !== this.options.length) { return found; }

  Shopify.each(this.variants, function(variant) {
    var satisfied = true;
    for (var j = 0; j < selectedValues.length; j++) {
      var optionCol = 'option' + (j + 1);
      if (variant[optionCol] !== selectedValues[j]) {
        satisfied = false;
      }
    }
    if (satisfied === true) {
      found = variant;
      return;
    }
  });
  return found;
};

slate.Product.prototype.getVariantById = function(id) {
  for (var i = 0; i < this.variants.length; i++) {
    var variant = this.variants[i];

    if (id === variant.id) {
      return variant;
    }
  }

  return null;
};
