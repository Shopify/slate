window.theme = window.theme || {};

// =require vendor/jquery-2.2.3.min.js
// =require vendor/modernizr.min.js

// =require slate/a11y.js
// =require slate/forms.js
// =require slate/uri-helpers.js
// =require slate/video.js


theme.variables = {
  queryParams: slate.QueryString.parse(location.search)
};

$(document).ready(function() {

  // Include Template Scripts
  // ----------------------------------------------------------------------------
  // =require templates/customer-addresses.js
  // =require templates/gift-card.js
  // =require templates/login.js
  // =require templates/product.js

  // Custom Theme Scripts
  // ---------------------------------------------------------------------------

  // Common a11y fixes
  slate.a11y.pageLinkFocus($(window.location.hash));

  $('.in-page-link').on('click', function(evt) {
    slate.a11y.pageLinkFocus($(evt.currentTarget.hash));
  });

  // Override defaults in theme.strings with potential template overrides
  window.productStrings = window.productStrings || {};
  $.extend(theme.strings, window.productStrings);

  // Wrap tables in the RTE with a scrollable div so they cannot break the
  // layout if too wide.
  $('.rte table').wrap('<div class="rte-table"></div>');

  // Wrap videos in div to force responsive layout.
  slate.iframes.iframeReset();
});
