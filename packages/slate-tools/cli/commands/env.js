const slateEnv = require('@yourwishes/slate-env');
const argv = require('minimist')(process.argv.slice(2));

slateEnv.create({ name: argv.env || undefined });
console.log('Generated your shiny new ENV file!');