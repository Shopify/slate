window.theme = window.theme || {};

/**
 * Customer Addresses Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Customer Addresses
 * template.
 *
 * @namespace customerAddresses
 */

theme.customerAddresses = (function() {
  var config = {
    formId: '#AddressNewForm',
    countryOption: '.address-country-option',
    addressDelete: '.address-delete',
    editToggle: '.address-edit-toggle',
    newToggle: '.address-new-toggle',
    editAddress: '#EditAddress_'
  };

  var $newAddressForm = $(config.formId);

  if (!$newAddressForm.length) { return; }

  // Initialize observers on address selectors, defined in shopify_common.js
  slate.forms.addressObserver();

  // Initialize each edit form's country/province selector
  $(config.countryOption).each(function() {
    slate.forms.countryProvinceSelector($(this));
  });

  // Toggle new/edit address forms
  $(config.newToggle).on('click', function() {
    $newAddressForm.toggleClass('hide');
  });

  $(config.editToggle).on('click', function() {
    var formId = $(this).data('form-id');
    $(config.editAddress + formId).toggleClass('hide');
  });

  $(config.addressDelete).on('click', function() {
    slate.forms.deleteAddressInput($(this));
  });

})();


