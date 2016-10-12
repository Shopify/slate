module.exports = {

  // global/install tasks
  help: require('./commands/help'),
  version: require('./commands/version'),
  upload: require('./commands/upload'),
  remove: require('./commands/remove'),
  replace: require('./commands/replace'),

  // generator functions
  new: require('./commands/new'),

  // local theme tasks
  start: require('./commands/theme/start'),
  test: require('./commands/theme/test'),
  build: require('./commands/theme/build'),
  deploy: require('./commands/theme/deploy'),
  watch: require('./commands/theme/watch'),
  zip: require('./commands/theme/zip')
};
