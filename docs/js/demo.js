/*
 * jQuery throttle / debounce - v1.1 - 3/7/2010
 * http://benalman.com/projects/jquery-throttle-debounce-plugin/
 *
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function(b,c){var $=b.jQuery||b.Cowboy||(b.Cowboy={}),a;$.throttle=a=function(e,f,j,i){var h,d=0;if(typeof f!=="boolean"){i=j;j=f;f=c}function g(){var o=this,m=+new Date()-d,n=arguments;function l(){d=+new Date();j.apply(o,n)}function k(){h=c}if(i&&!h){l()}h&&clearTimeout(h);if(i===c&&m>e){l()}else{if(f!==true){h=setTimeout(i?k:l,i===c?e-m:e)}}}if($.guid){g.guid=j.guid=j.guid||$.guid++}return g};$.debounce=function(d,e,f){return f===c?a(d,e,false):a(d,f,e!==false)}})(this);

function resizeIframeToContents(iframe) {
  iframe.style.height = iframe.contentWindow.document.body.offsetHeight + 5 + 'px';
};

$(function() {
  $('.demo-iframe').find('iframe').on('load', function() {
    resizeIframeToContents(this);
  });

  $(window).on('resize', $.debounce(250, function() {
    $('.demo-iframe').find('iframe').each(function() {
      resizeIframeToContents(this);
    });
  }));

  $('.iframe-toggle').on('click', function() {
    var $el = $(this);
    var $iframe = $el.parent().next('iframe');
    var sizeMobile = $el.data('size') === 'mobile';
    if (sizeMobile) {
      $iframe.addClass('demo-iframe--mobile');
    } else {
      $iframe.removeClass('demo-iframe--mobile');
    }

    $iframe.one('TransitionEnd webkitTransitionEnd transitionend oTransitionEnd', function() {
      resizeIframeToContents($iframe[0]);
    })
  });
});
