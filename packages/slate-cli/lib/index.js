module.exports = {

  // global tasks
  // ------------
  help: require('./commands/help'),
  version: require('./commands/version'),
  //setup: require('./commands/setup'),
  //update: require('./commands/update'),

  new: require('./commands/new'),
  //init: require('./commands/init'),
  theme: require('./commands/theme')
};
