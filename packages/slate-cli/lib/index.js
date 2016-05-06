module.exports = {
  // global tasks
  help: require('./commands/help'),
  // update: require('./commands/update'),
  version: require('./commands/version'),

  // generators [ ie. `slate new theme`, `slate new section`, etc. ]
  new: require('./commands/new')

  // local tasks
  // build: require('./commands/build'),
  // watch: require('./commands/watch'),
  // deploy: require('./commands/deploy')
};
