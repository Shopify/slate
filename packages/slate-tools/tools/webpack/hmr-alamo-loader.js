/* eslint-disable no-underscore-dangle */
const SlateConfig = require('@process-creative/slate-config');
const config = new SlateConfig(require('../../slate-tools.schema'));

const jsEntries = Object.keys(config.get('webpack.entrypoints')).reduce(
  (carry, key) => {
    const entry = config.get('webpack.entrypoints')[key];
    const entryArray = Array.isArray(entry) ? entry : [entry];
    const jsEntryArray = entryArray.filter((version) =>
      version.endsWith('.js'),
    );

    return [...carry, ...jsEntryArray];
  },
  [],
);

/**
 * Adds a small script to flag unhandled HMR events.
 */
module.exports = function hmrAlamoLoader(content) {
  if (!jsEntries.includes(this._module.resource)) {
    return content;
  }

  const alamo = `
    // If we reached this module (the entry point), it means no one accepted the HRM.
    // Let's reload the page then.
    if (module.hot) {
      module.hot.accept();

      // On first load, module.hot.data is undefined since it is not an update...
      // So if we do have a data object, it means we've been HMR'ed.
      if (module.hot.data) {
        window.__slate_should_reload__ = true;
      }
    }
  `;

  return `${content}\n\n${alamo}`;
};
