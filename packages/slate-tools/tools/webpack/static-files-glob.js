/* eslint-disable */

//
// What is this ? Why is this here ? Read on.
//
// This is used as an entry point in webpack.base.conf.js. It dynamically
// require all liquid and json files from the user's directory (except theme.liquid)
// as well as everything inside the src/assets/static directory.
//
// Why not use require.context() you ask ? This would work if we'd want to require
// files from this tool's directory, but not from the user's directory, as you can't
// pass a variable as it's first argument. Hence we rely on the
// `ContextReplacementPlugin` to swap a dynamic require with a context looking into
// the right directory (the user's directory).
//
// - https://webpack.github.io/docs/context.html#critical-dependencies
// > If the module source contains a require that cannot be statically analyzed,
// > the context is the current directory.
// > In this case a Critical dependencies warning is emitted.
// > You need to use the ContextReplacementPlugin in most cases.
//
// For the `ContextReplacementPlugin` to kick in, we need to make our require
// dynamic, hence the use of a variable (`dynamicCtx`).
// The context we look for, and replace, is the `__app[src|static]__` part.
//
var dynamicCtx = 'salut';
require('__appsrc__/layout' + dynamicCtx + '.liquid');
require('__appsrc__/sections' + dynamicCtx + '.liquid');
require('__appsrc__/snippets' + dynamicCtx + '.liquid');
require('__appsrc__/templates' + dynamicCtx + '.liquid');
require('__appstatic__/' + dynamicCtx);
