/* eslint-disable */

/*******************************************************************************
 * Development script
 *
 * This script is only included on the page when Browsersync is being used. It's
 * a great place to put any customizations that you only want to occur while
 * developing your theme.
 ******************************************************************************/


/**
 * Persistent preview bar minimization
 *
 * Adds a token to sessionStorage when the 'minimize' button is clicked on the
 * preview bar that appears when previewing an unpublished theme. This token is
 * checked for on subsequent page loads, and if found, the preview is hidden.
 */

(function() {
  if (!isSessionStorageSupported()) { return; }

  window.addEventListener('DOMContentLoaded', function() {
    var previewBarMinimizeElement = document.getElementsByClassName('shopify-preview-bar__minimize');

    if (previewBarMinimizeElement.length > 0) {
      previewBarMinimizeElement[0].addEventListener('click', onButtonClick);
    }

    if (window.sessionStorage.getItem('preview-bar-hidden')) {
      hidePreviewBar();
    }
  });

  function onButtonClick(event) {
    var element = event.target;

    window.sessionStorage.setItem('preview-bar-hidden', 'true');
    hidePreviewBar();
    document.removeEventListener('click', onButtonClick);
  }

  function hidePreviewBar() {
    injectStyles('.shopify-preview-bar { display:none; }');
  }

  function injectStyles(css) {
    var head = document.getElementsByTagName('head')[0];
    var style = document.createElement('style');

    style.setAttribute('type', 'text/css');

    if (style.styleSheet) { // IE
      style.styleSheet.cssText = css;
    } else { // Everything else
      style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style);
  }

  function isSessionStorageSupported() {
    var mod = 'slate';
    try {
      sessionStorage.setItem(mod, mod);
      sessionStorage.removeItem(mod);
      return true;
    } catch (e) {
      return false;
    }
  }
})();
/* eslint-enable */
