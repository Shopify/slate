var $ = require('jquery');
var a11y = require('./../slate/a11y.js');
var rte = require('./../slate/rte.js');

// Common a11y fixes
a11y.pageLinkFocus($(window.location.hash));

$('.in-page-link').on('click', function(evt) {
  a11y.pageLinkFocus($(evt.currentTarget.hash));
});

// Wrap videos in div to force responsive layout.
rte.wrapTable();
rte.iframeReset();
