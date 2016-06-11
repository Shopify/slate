#!/usr/bin/env node
var _ = require('lodash');
var parseOptions = require('nopt');
var slate = require('../lib');
// var pkg = require('../package.json');
// require('update-notifier')({packageName: pkg.name,packageVersion: pkg.version}).notify();

var validOpts = {
  version: Boolean,
  manual: Boolean, // flag for manual deploy (used with deploy command)
  nosync: Boolean
};
var shorthand = {
  v: '--version',
  m: '--manual',
  ns: '--nosync'
};

// filtered list of valid options that were passed w/ the command
var opts = parseOptions(validOpts, shorthand);
if (opts.argv.remain[0]) {
  var command = opts.argv.remain[0];
  var args = opts.argv.remain.slice(1); // the remaining args passed with the command

  if (_.isFunction(slate[command])) {
    slate[command](args, opts);
  } else {
    slate.help();
  }

// No args were passed...
} else {
  if (opts.version) {
    slate.version();
  } else {
    slate.help();
  }
}
