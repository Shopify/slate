/* eslint-disable */
/* global __webpack_public_path__ __slate_should_reload__ window */
// remove trailing slash from webpack public path
// see https://github.com/glenjamin/webpack-hot-middleware/issues/154
const tmpPublicPath = __webpack_public_path__;
__webpack_public_path__ = __webpack_public_path__.replace(/\/$/, '');
const client = require('webpack-hot-middleware/client?dynamicPublicPath=true&reload=true');
// and add the trailing slash again so we don't run into issue with webpack itself...
__webpack_public_path__ = tmpPublicPath;

// Entry points sets this to true if no modules accepted the HMR
window.__slate_should_reload__ = false;

client.subscribe((event) => {
  if (event.action === 'shopify_upload_finished') {
    // Reload either if the serve force's our hand or if the entry point module
    if (event.force || window.__slate_should_reload__) {

      //Force cache reload
      let newSearch = (window.location.search||'')
        .split('&')
        .map(t => t.split('=').map(t => decodeURIComponent(t)))
        .filter(kvp => kvp[0] != 't' && kvp[0] != 'cache')
      ;

      newSearch.push([ 't', Math.random() ]);
      newSearch.push([ 'cache', false ]);

      newSearch = newSearch
        .map(kvp => kvp.join('='))
        .join('&')
      ;
      
      setTimeout(() => window.location.search = newSearch, 2000);
    }
  }
});
