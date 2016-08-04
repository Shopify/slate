require('./templates/customer-addresses');
require('./templates/gift-card');
require('./templates/login');
require('./templates/product');

var a11y = require('./slate/a11y');
var uriHelpers = require('./slate/uri-helpers');
var iframes = require('./slate/iframes');


var theme = {
  variables: {
    queryParams: uriHelpers.parse(location.search)
  }
};

$(document).ready(function() {
  // Custom Theme Scripts
  // ---------------------------------------------------------------------------

  // Common a11y fixes
  a11y.pageLinkFocus($(window.location.hash));

  $('.in-page-link').on('click', function(evt) {
    a11y.pageLinkFocus($(evt.currentTarget.hash));
  });

  // Override defaults in theme.strings with potential template overrides
  window.productStrings = window.productStrings || {};
  $.extend(theme.strings, window.productStrings);

  // Wrap tables in the RTE with a scrollable div so they cannot break the
  // layout if too wide.
  $('.rte table').wrap('<div class="rte__table-wrapper"></div>');

  // Wrap videos in div to force responsive layout.
  iframes.iframeReset();
});
