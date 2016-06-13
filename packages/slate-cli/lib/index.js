module.exports = {

  // global/install tasks
  help: require('./commands/help'),
  version: require('./commands/version'),
  //setup: require('./commands/setup'),
  //update: require('./commands/update'),

  // generator functions
  new: require('./commands/new'),
  //init: require('./commands/init'),

  // local theme tasks
  start: require('./commands/theme/start'),
  test: require('./commands/theme/test'),
  build: require('./commands/theme/build'),
  deploy: require('./commands/theme/deploy'),
  watch: require('./commands/theme/watch'),
  zip: require('./commands/theme/zip')
};
