window.slate = window.slate || {};

/**
 * Image Helper Functions
 * -----------------------------------------------------------------------------
 * A collection of functions that help with basic image operations.
 *
 */

slate.images = {

  /**
   * Preloads an image in memory and uses the browsers cache to store it until needed.
   *
   * @param {Array} images - A list of image urls
   * @param {String} size - A shopify image size attribute
   */

  preload: function (images, size) {
    for (var i=0; i < images.length; i++) {
      var image = images[i];

      this.loadImage(this.getSizedImageUrl(image, size));
    }
  },

  /**
   * Loads and caches an image in the browsers cache.
   * @param {string} path - An image url
   */
  loadImage: function (path) {
    new Image().src = path;
  },

  /**
   * Swaps the src of an image for another OR returns the imageURL to the callback function
   * @param image
   * @param element
   * @param callback
   */
  switchImage: function (image, element, callback) {
    var size = this.imageSize(element.src);
    var imageUrl = this.getSizedImageUrl(image.src, size);

    if (callback) {
      callback(imageUrl, image, element);
    } else {
      element.src = imageUrl;
    }
  },

  /**
   * +++ Useful
   * Find the Shopify image attribute size
   *
   * @param {string} src
   * @returns {null}
   */
  imageSize: function (src) {
    var match = src.match(/_(1024x1024|2048x2048|pico|icon|thumb|small|compact|medium|large|grande)\./);
    return match !== null ? match[1] : null;
  },

  /**
   * +++ Useful
   * Adds a Shopify size attribute to a URL
   *
   * @param src
   * @param size
   * @returns {*}
   */
  getSizedImageUrl: function (src, size) {
    if (size == null) {
      return src;
    }

    if (size == 'master') {
      return this.removeProtocol(src);
    }

    var match  = src.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);

    if (match != null) {
      var prefix = src.split(match[0]);
      var suffix = match[0];

      return this.removeProtocol(prefix[0] + "_" + size + suffix);
    } else {
      return null;
    }
  },

  removeProtocol: function (path) {
    return path.replace(/http(s)?:/, "");
  }
};
