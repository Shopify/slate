window.slate = window.slate || {};
// =require ../slate/a11y.js
// =require ../slate/rte.js

$(document).ready(function() {
  // Common a11y fixes
  slate.a11y.pageLinkFocus($(window.location.hash));

  $('.in-page-link').on('click', function(evt) {
    slate.a11y.pageLinkFocus($(evt.currentTarget.hash));
  });

  // Wrap videos in div to force responsive layout.
  slate.rte.wrapTable();
  slate.rte.iframeReset();
});
