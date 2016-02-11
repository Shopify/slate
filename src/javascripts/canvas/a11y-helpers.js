ShopifyCanvas.A11yHelpers = (function () {
  var A11yHelpers = function () {
    this.init();

    $('.in-page-link').on('click', $.proxy(function (evt) {
      this.pageLinkFocus($(evt.currentTarget.hash));
    }, this));
  };

  A11yHelpers.prototype.init = function () {
    // on init, check if we need to set page focus
    var hash = window.location.hash;
      if (hash) {
        if (document.getElementById(hash.slice(1))) {
          this.pageLinkFocus($(hash));
        }
      }
  };

  A11yHelpers.prototype.trapFocus = function ($container, eventNamespace) {
    var eventName = eventNamespace ? 'focusin.' + eventNamespace : 'focusin';

    $container.attr('tabindex', '-1');
    $(document).on(eventName, function (evt) {
      if ($container[0] !== evt.target && !$container.has(evt.target).length) {
        $container.focus();
      }
    });
  };

  A11yHelpers.prototype.removeTrapFocus = function ($container, eventNamespace) {
    var eventName = eventNamespace ? 'focusin.' + eventNamespace : 'focusin';

    $container.removeAttr('tabindex');
    $(document).off(eventName);
  };

  /*
   * For use when focus shifts to a container rather than a link
   * eg for In-page links, after scroll, focus shifts to content area
   * so that next `tab` is where user expects
   * if focusing a link, just $link.focus();
  */
  A11yHelpers.prototype.pageLinkFocus = function ($element) {
    if ($element.length) {
      $element.get(0).tabIndex = -1;
      $element.focus().addClass('js-focus-hidden');
      $element.one('blur', function () {
        $element
          .removeClass('js-focus-hidden')
          .removeAttr('tabindex');
      });
    }
  };

  return A11yHelpers;
})();
