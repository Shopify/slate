module.exports = (...params) =>
  new RegExp(['node_modules', 'assets/vendors/', ...params].join('|'));
