module.exports = {
  'some.key': 'override-value',

  // path is undefined on purpose here
  'other.item': path.resolve(__dirname), // eslint-disable-line no-undef
};
