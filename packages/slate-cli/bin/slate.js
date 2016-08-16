#!/usr/bin/env node

var _ = require('lodash');
var parseOptions = require('nopt');
var slate = require('../index.js');
var msg = require('../includes/messages.js');
// var pkg = require('../package.json');
// require('update-notifier')({packageName: pkg.name,packageVersion: pkg.version}).notify();

/* eslint-disable quote-props ,id-length */
var validOpts = {
  'active': Boolean,
  'environment': String,
  'help': Boolean,
  'manual': Boolean, // flag for manual deploy (used with deploy command)
  'nosync': Boolean,
  'version': Boolean
};

var shorthand = {
  a: '--active',
  e: '--environment',
  h: '--help',
  m: '--manual',
  n: '--nosync',
  v: '--version'
};

// filtered list of valid options that were passed w/ the command
var opts = parseOptions(validOpts, shorthand);
if (opts.argv.remain[0]) {
  var command = opts.argv.remain[0]; // the first arg in the `remain` array is the command
  var args = opts.argv.remain.slice(1); // the remaining args to be passed with the command

  if (_.has(slate, command) && _.isFunction(slate[command].command)) {
    if (opts.help) {
      slate[command].help();
    } else {
      slate[command].command(args, opts);
    }
  } else {
    process.stdout.write(msg.unknownCommand());
    slate.help.command();
  }

  // No args were passed...
} else {
  if (opts.version) {
    slate.version.command();
  } else {
    slate.help.command();
  }
}
