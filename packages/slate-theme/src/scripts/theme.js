window.slate = window.slate || {};
window.theme = window.theme || {};

import a11y from './slate/a11y';
import cart from './slate/cart';
import rte from './slate/rte';
import Sections from './slate/sections';

/*================ Sections ================*/
import productSection from './sections/product'

/*================ Templates ================*/
import './templates/customers-addresses'
import './templates/customers-login.js'

$(document).ready(function() {
  var sections = new Sections();
  sections.register('product', theme.Product);

  // Common a11y fixes
 a11y.pageLinkFocus($(window.location.hash));

  $('.in-page-link').on('click', function(evt) {
   a11y.pageLinkFocus($(evt.currentTarget.hash));
  });

  // Target tables to make them scrollable
  var tableSelectors = '.rte table';

  rte.wrapTable({
    $tables: $(tableSelectors),
    tableWrapperClass: 'rte__table-wrapper',
  });

  // Target iframes to make them responsive
  var iframeSelectors =
    '.rte iframe[src*="youtube.com/embed"],' +
    '.rte iframe[src*="player.vimeo"]';

  rte.wrapIframe({
    $iframes: $(iframeSelectors),
    iframeWrapperClass: 'rte__video-wrapper'
  });

  // Apply a specific class to the html element for browser support of cookies.
  if (cart.cookiesEnabled()) {
    document.documentElement.className = document.documentElement.className.replace('supports-no-cookies', 'supports-cookies');
  }
});
