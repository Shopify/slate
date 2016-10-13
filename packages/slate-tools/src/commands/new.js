module.exports = function(program) {
  program
    .command('new <generator>')
    .alias('n')
    .description('Scaffold a component.')
    .action((generator) => {
      console.log(`Looks like you want a new ${generator}... I wish I had one.`);
    });
};
