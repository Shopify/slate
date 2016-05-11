window.slate = window.slate || {};

/**
 * _forms.js
 * -----------------------------------------------------------------------------
 * A collection of helper functions for common forms found throughout a Shopify
 * storefront.
 *
 * @namespace forms
 */

slate.forms = {

  /**
   * Initialize observers on address selectors, defined in shopify_common.js
   *
   * @returns {Shopify.CountryProvinceSelector}
   */
  addressObserver: function() {
    if (!Shopify) { return false; }

    return new Shopify.CountryProvinceSelector('AddressCountryNew', 'AddressProvinceNew', {hideElement: 'AddressProvinceContainerNew'});
  },

  /**
   * Initializes a new instance of a Shopify Country and Province selector
   *
   * @param $el {jquery selection}
   * @returns {Shopify.CountryProvinceSelector}
   */
  countryProvinceSelector: function($el) {
    var formId = $el.data('form-id');
    var countrySelector = 'AddressCountry_' + formId;
    var provinceSelector = 'AddressProvince_' + formId;
    var containerSelector = 'AddressProvinceContainer_' + formId;

    return new Shopify.CountryProvinceSelector(countrySelector, provinceSelector, {hideElement: containerSelector});
  },

  /**
   *
   * @param $el
   */
  deleteAddressInput: function($el) {

    var formId = $el.data('form-id');
    var confirmMessage = $el.data('confirm-message');
    if (confirm(confirmMessage || 'Are you sure you wish to delete this address?')) {
      Shopify.postLink('/account/addresses/' + formId, {parameters: {_method: 'delete'}});
    }
  }

};

// ---------------------------------------------------------------------------
// OptionSelectors(domid, options)
//
// ---------------------------------------------------------------------------


slate.OptionSelectors = function(existingSelectorId, options) {
  this.selectorDivClass = 'selector-wrapper';
  this.selectorClass = 'single-option-selector';
  this.variantIdFieldIdSuffix = '-variant-id';

  this.variantIdField = null;
  this.historyState = null;
  this.selectors = [];
  this.domIdPrefix = existingSelectorId;
  this.product = new Shopify.Product(options.product);
  this.onVariantSelected = Shopify.isDefined(options.onVariantSelected) ? options.onVariantSelected : function() {};

  this.replaceSelector(existingSelectorId); // create the dropdowns
  this.initDropdown();

  if (options.enableHistoryState) {
    this.historyState = new Shopify.OptionSelectors.HistoryState(this);
  }

  return true;
};

slate.OptionSelectors.prototype.initDropdown = function() {
  var options = {initialLoad: true};
  var successDropdownSelection = this.selectVariantFromDropdown(options);

  if (!successDropdownSelection) {
    var self = this;
    setTimeout(function() {
      if (!self.selectVariantFromParams(options)) {
        self.fireOnChangeForFirstDropdown.call(self, options);
      }
    });
  }
};

slate.OptionSelectors.prototype.fireOnChangeForFirstDropdown = function(options) {
  this.selectors[0].element.onchange(options);
};

slate.OptionSelectors.prototype.selectVariantFromParamsOrDropdown = function(options) {
  var success = this.selectVariantFromParams(options);

  if (!success) {
    this.selectVariantFromDropdown(options);
  }
};

// insert new multi-selectors and hide original selector
slate.OptionSelectors.prototype.replaceSelector = function(domId) {
  var oldSelector = document.getElementById(domId);
  var parent = oldSelector.parentNode;
  Shopify.each(this.buildSelectors(), function(el) {
    parent.insertBefore(el, oldSelector);
  });
  oldSelector.style.display = 'none';
  this.variantIdField = oldSelector;
};

slate.OptionSelectors.prototype.selectVariantFromDropdown = function(options) {
  // get selected variant from hidden dropdown
  var option = document.getElementById(this.domIdPrefix).querySelector('[selected]');

  // If selected attr above is null, selected="selected" may exist (depending on DOM)
  if (!option) {
    option = document.getElementById(this.domIdPrefix).querySelector('[selected="selected"]');
  }

  if (!option) {
    return false;
  }

  var variantId = option.value;
  return this.selectVariant(variantId, options);
};

slate.OptionSelectors.prototype.selectVariantFromParams = function(options) {
  var variantId = Shopify.urlParam('variant');
  return this.selectVariant(variantId, options);
};

slate.OptionSelectors.prototype.selectVariant = function(variantId, options) {
  var variant = this.product.getVariantById(variantId);

  if (variant == null) {
    return false;
  }

  for (var i = 0; i < this.selectors.length; i++) {
    var element = this.selectors[i].element;
    var optionName = element.getAttribute('data-option');
    var value = variant[optionName];
    if (value == null || !this.optionExistInSelect(element, value)) {
      continue;
    }

    element.value = value;
  }

  if (typeof jQuery !== 'undefined') {
    jQuery(this.selectors[0].element).trigger('change', options);
  } else {
    this.selectors[0].element.onchange(options);
  }

  return true;
};

slate.OptionSelectors.prototype.optionExistInSelect = function(select, value) {
  for (var i = 0; i < select.options.length; i++) {
    if (select.options[i].value === value) {
      return true;
    }
  }
};

// insertSelectors(domId, msgDomId)
// create multi-selectors in the given domId, and use msgDomId to show messages
slate.OptionSelectors.prototype.insertSelectors = function(domId, messageElementId) {
  if (Shopify.isDefined(messageElementId)) { this.setMessageElement(messageElementId); }

  this.domIdPrefix = 'product-' + this.product.id + '-variant-selector';

  var parent = document.getElementById(domId);
  Shopify.each(this.buildSelectors(), function(el) {
    parent.appendChild(el);
  });
};

// buildSelectors(index)
// create and return new selector element for given option
slate.OptionSelectors.prototype.buildSelectors = function() {
  // build selectors
  for (var i = 0; i < this.product.optionNames().length; i++) {
    var sel = new Shopify.SingleOptionSelector(this, i, this.product.optionNames()[i], this.product.optionValues(i));
    sel.element.disabled = false;
    this.selectors.push(sel);
  }

  // replace existing selector with new selectors, new hidden input field, new hidden messageElement
  var divClass = this.selectorDivClass;
  var optionNames = this.product.optionNames();
  var elements = Shopify.map(this.selectors, function(selector) {
    var div = document.createElement('div');
    div.setAttribute('class', divClass);
    // create label if more than 1 option (ie: more than one drop down)
    if (optionNames.length > 1) {
      // create and appened a label into div
      var label = document.createElement('label');
      label.htmlFor = selector.element.id;
      label.innerHTML = selector.name;
      div.appendChild(label);
    }
    div.appendChild(selector.element);
    return div;
  });

  return elements;
};

// returns array of currently selected values from all multiselectors
slate.OptionSelectors.prototype.selectedValues = function() {
  var currValues = [];
  for (var i = 0; i < this.selectors.length; i++) {
    var thisValue = this.selectors[i].element.value;
    currValues.push(thisValue);
  }
  return currValues;
};

// callback when a selector is updated.
slate.OptionSelectors.prototype.updateSelectors = function(index, options) {
  var currValues = this.selectedValues(); // get current values
  var variant = this.product.getVariant(currValues);
  if (variant) {
    this.variantIdField.disabled = false;
    this.variantIdField.value = variant.id; // update hidden selector with new variant id
  } else {
    this.variantIdField.disabled = true;
  }

  this.onVariantSelected(variant, this, options);  // callback

  if (this.historyState != null) {
    this.historyState.onVariantChange(variant, this, options);
  }
};

// ---------------------------------------------------------------------------
// OptionSelectorsFromDOM(domid, options)
//
// ---------------------------------------------------------------------------

slate.OptionSelectorsFromDOM = function(existingSelectorId, options) {
  // build product json from selectors
  // create new options hash
  var optionNames = options.optionNames || [];
  var priceFieldExists = options.priceFieldExists || true;
  var delimiter = options.delimiter || '/';
  var productObj = this.createProductFromSelector(existingSelectorId, optionNames, priceFieldExists, delimiter);
  options.product = productObj;
  Shopify.OptionSelectorsFromDOM.baseConstructor.call(this, existingSelectorId, options);
};

// slate.extend(slate.OptionSelectorsFromDOM, slate.OptionSelectors);

// updates the product_json from existing select element
slate.OptionSelectorsFromDOM.prototype.createProductFromSelector = function(domId, optionNames, priceFieldExists, delimiter) {
  if (!Shopify.isDefined(priceFieldExists)) { priceFieldExists = true; }
  if (!Shopify.isDefined(delimiter)) { delimiter = '/'; }

  var oldSelector = document.getElementById(domId);
  var options = oldSelector.childNodes;
  var parent = oldSelector.parentNode;

  var optionCount = optionNames.length;

  // build product json + messages array
  var variants = [];
  var self = this;
  Shopify.each(options, function(option, variantIndex) {
    if (option.nodeType == 1 && option.tagName.toLowerCase() == 'option') {
      var chunks = option.innerHTML.split(new RegExp('\\s*\\'+ delimiter +'\\s*'));

      if (optionNames.length == 0) {
        optionCount = chunks.length - (priceFieldExists ? 1 : 0);
      }

      var optionOptionValues = chunks.slice(0, optionCount);
      var message = (priceFieldExists ? chunks[optionCount] : '');
      var variantId = option.getAttribute('value');

      var attributes = {
        available: (option.disabled ? false : true),
        id: parseFloat(option.value),
        price: message,
        option1: optionOptionValues[0],
        option2: optionOptionValues[1],
        option3: optionOptionValues[2]
      };
      variants.push(attributes);
    }
  });
  var updateObj = {variants: variants};
  if (optionNames.length === 0) {
    updateObj.options = [];
    for (var i = 0; i < optionCount; i++) { updateObj.options[i] = ('option ' + (i + 1)); }
  } else {
    updateObj.options = optionNames;
  }
  return updateObj;
};


// ---------------------------------------------------------------------------
// SingleOptionSelector
// takes option name and values and creates a option selector from them
// ---------------------------------------------------------------------------
slate.SingleOptionSelector = function(multiSelector, index, name, values) {
  this.multiSelector = multiSelector;
  this.values = values;
  this.index = index;
  this.name = name;
  this.element = document.createElement('select');
  for (var i = 0; i < values.length; i++) {
    var opt = document.createElement('option');
    opt.value = values[i];
    opt.innerHTML = values[i];
    this.element.appendChild(opt);
  }
  this.element.setAttribute('class', this.multiSelector.selectorClass);
  this.element.setAttribute('data-option', 'option' + (index + 1));
  this.element.id = multiSelector.domIdPrefix + '-option-' + index;
  this.element.onchange = function(event, options) {
    options = options || {};

    multiSelector.updateSelectors(index, options);
  };

  return true;
};


// ---------------------------------------------------------------------------
// Shopify.HistoryState
// Gets events from Push State
// ---------------------------------------------------------------------------

slate.OptionSelectors.HistoryState = function(optionSelector) {
  if (this.browserSupports()) {
    this.register(optionSelector);
  }
};

slate.OptionSelectors.HistoryState.prototype.register = function(optionSelector) {
  window.addEventListener('popstate', function() {
    optionSelector.selectVariantFromParamsOrDropdown({popStateCall: true});
  });
};

slate.OptionSelectors.HistoryState.prototype.onVariantChange = function(variant, selector, data) {
  if (this.browserSupports()) {
    if (variant && !data.initialLoad && !data.popStateCall) {
      Shopify.setParam('variant', variant.id);
    }
  }
};

slate.OptionSelectors.HistoryState.prototype.browserSupports = function() {
  return window.history && window.history.replaceState;
};


/* CountryProvinceSelector
 * js class that adds listener to country selector and on change updates
 * province selector with valid province values.
 * Selector should be in this format:
 *
 *   <select id="country_selector" name="country" data-default="Canada">
 *     <option data-provinces="['Alberta','Ontario','British Columbia',...] value="Canada">Canada</option>
 *     ...
 *   </select>
 *   <select id="province_selector" name="province" data-default="Ontario">
 *     <option value="Ontario">Ontario</option>
 *     ...
 *   </select>
 */
slate.CountryProvinceSelector = function(countryDomId, provinceDomId, options) {
  this.countryEl = document.getElementById(countryDomId);
  this.provinceEl = document.getElementById(provinceDomId);
  this.provinceContainer = document.getElementById(options.hideElement || provinceDomId);

  Shopify.addListener(this.countryEl, 'change', Shopify.bind(this.countryHandler, this));

  this.initCountry();
  this.initProvince();
};

slate.CountryProvinceSelector.prototype = {
  initCountry: function() {
    var value = this.countryEl.getAttribute('data-default');
    Shopify.setSelectorByValue(this.countryEl, value);
    this.countryHandler();
  },

  initProvince: function() {
    var value = this.provinceEl.getAttribute('data-default');
    if (value && this.provinceEl.options.length > 0) {
      Shopify.setSelectorByValue(this.provinceEl, value);
    }
  },

  countryHandler: function() {
    var opt = this.countryEl.options[this.countryEl.selectedIndex];
    var raw = opt.getAttribute('data-provinces');
    var provinces = JSON.parse(raw);

    this.clearOptions(this.provinceEl);
    if (provinces && provinces.length === 0) {
      this.provinceContainer.style.display = 'none';
    } else {
      for (var i = 0; i < provinces.length; i++) {
        var opt = document.createElement('option');
        opt.value = provinces[i][0];
        opt.innerHTML = provinces[i][1];
        this.provinceEl.appendChild(opt);
      }

      this.provinceContainer.style.display = '';
    }
  },

  clearOptions: function(selector) {
    while (selector.firstChild) {
      selector.removeChild(selector.firstChild);
    }
  },

  setOptions: function(selector, values) {
    for (var i = 0; i < values.length; i++) {
      var opt = document.createElement('option');
      opt.value = values[i];
      opt.innerHTML = values[i];
      selector.appendChild(opt);
    }
  }
};


