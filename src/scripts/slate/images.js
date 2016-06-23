window.slate = window.slate || {};

/**
 * Image Helper Functions
 * -----------------------------------------------------------------------------
 * A collection of functions that help with basic Shopify image operations.
 */

slate.images = {

  /**
   * Find the Shopify image attribute size
   *
   * @param {string} src - URL of image
   * @returns {string | null} - Returns size of image or null if not found
   */
  imageSize: function(src) {
    var imageSizes = ['pico', 'icon', 'thumb', 'small', 'compact', 'medium', 'large', 'grande', '1024x1024', '2048x2048'];
    // eslint-disable-next-line no-useless-escape
    return src.match(new RegExp('/_(' + imageSizes.join('|') + ')\./'))[1];
  },

  /**
   * Get the file extension from an image URL
   *
   * @param {string} src - URL of image
   * @returns {string | null} - Returns extension of image or null if not found
   */
  imageExtension: function(src) {
    var imageExtensions = ['jpg', 'jpeg', 'gif', 'png', 'bmp', 'bitmap', 'tiff', 'tif'];
    // eslint-disable-next-line no-useless-escape
    return src.match(new RegExp('/\.(' + imageExtensions.join('|') + ')(\?v=\d+)?$', 'i'))[1];
  },

  /**
   * Get the master URL for an image
   *
   * @param {string} src - URL of image
   * @returns {string} - URL of master image
   */
  masterImage: function(src) {
    var srcSize = this.imageSize(src) || 'master';
    if (srcSize !== 'master') {
      src = src.replace(new RegExp('_' + srcSize), '');
    }
    return src.replace(/http(s)?:/, '');
  },

  /**
   * Get the URL for a specific size of image if specified, otherwise return the
   * master URL.
   *
   * @param {string} src - URL of image
   * @param {string} [size] - Shopify image size string
   * @returns {string} - URL of sized iamge
   */
  sizedImage: function(src, size) {
    var srcExt = this.imageExtension(src);
    src = this.masterImage(src);
    if (size !== 'master') {
      src = src.replace(new RegExp('.' + srcExt), '_' + size + '.' + srcExt);
    }
    return src;
  }
};
