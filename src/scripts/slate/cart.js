/**
 * Cart Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Cart template.
 *
 * @namespace cart
 */

slate.cart = {

  selectors: {
    cartEmpty: '.cart--empty',
    cartNoCookies: 'cart--no-cookies'
  },

  checkCookies: function() {
    if (!this.cookiesEnabled()) {
      $(this.selectors.cartEmpty).addClass(this.selectors.cartNoCookies);
    }
  },
  
  /**
   * Check if cookies are enabled in the browser
   */
  cookiesEnabled: function() {
    var cookieEnabled = navigator.cookieEnabled;

    if (!cookieEnabled){
      document.cookie = 'testcookie';
      cookieEnabled = (document.cookie.indexOf('testcookie') !== -1);
    }
    return cookieEnabled;
  }
};
