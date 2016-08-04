window.slate = window.slate || {};

/**
 * forms.js
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
    // eslint-disable-next-line no-alert
    if (confirm(confirmMessage || 'Are you sure you wish to delete this address?')) {
      Shopify.postLink('/account/addresses/' + formId, {parameters: {_method: 'delete'}});
    }
  }
};
