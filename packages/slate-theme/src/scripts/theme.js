window.slate = window.slate || {};
window.theme = window.theme || {};

import { pageLinkFocus } from '@shopify/slate-a11y';
import { cookiesEnabled } from '@shopify/slate-cart';
import { wrapTable, wrapIframe } from '@shopify/slate-rte';
import sections from '@shopify/slate-sections';

/*================ Templates ================*/
import './templates/customers-addresses'
import './templates/customers-login.js'

$(document).ready(function() {
  // Common a11y fixes
 pageLinkFocus($(window.location.hash));

  $('.in-page-link').on('click', function(evt) {
    pageLinkFocus($(evt.currentTarget.hash));
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
  if (cookiesEnabled()) {
    document.documentElement.className = document.documentElement.className.replace('supports-no-cookies', 'supports-cookies');
  }
});
