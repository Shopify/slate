/* eslint no-undefined: "off" */

/**
 * URI Helper Functions
 * -----------------------------------------------------------------------------
 * Based off the node module query-string https://github.com/sindresorhus/query-string
 *
 * queryParams = slate.QueryString.parse(location.search)
 * queryParams.sort_by = 'created-descending'
 * location.search = slate.QueryString.stringify(queryParams);
 */

module.exports = (function() {
  function _encode(value) {
    return encodeURIComponent(value);
  }

  return {
    parse: function(str) {
      var ret = Object.create(null);

      if (typeof str !== 'string') {
        return ret;
      }

      str = str.trim().replace(/^(\?|#|&)/, '');

      if (!str) {
        return ret;
      }

      str.split('&').forEach(function(param) {
        var parts = param.replace(/\+/g, ' ').split('=');
        // Firefox (pre 40) decodes `%3D` to `=`
        // https://github.com/sindresorhus/query-string/pull/37
        var key = parts.shift();
        var val = parts.length > 0 ? parts.join('=') : undefined;

        key = decodeURIComponent(key);

        // missing `=` should be `null`:
        // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
        val = val === undefined ? null : decodeURIComponent(val);

        if (ret[key] === undefined) {
          ret[key] = val;
        } else if (Array.isArray(ret[key])) {
          ret[key].push(val);
        } else {
          ret[key] = [ret[key], val];
        }
      });

      return ret;
    },

    stringify: function(obj) {
      return obj ? Object.keys(obj).sort().map(function(key) {
        var val = obj[key];

        if (val === undefined) {
          return '';
        }

        if (val === null) {
          return key;
        }

        if (Array.isArray(val)) {
          var result = [];

          val.slice().sort().forEach(function(val2) {
            if (val2 === undefined) {
              return;
            }

            if (val2 === null) {
              result.push(_encode(key));
            } else {
              result.push(_encode(key) + '=' + _encode(val2));
            }
          });

          return result.join('&');
        }

        return _encode(key) + '=' + _encode(val);
      })
      .filter(function(x) {
        return x.length > 0;
      })
      .join('&') : '';
    }
  };
})();
