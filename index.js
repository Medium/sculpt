// Copyright 2014. A Medium Corporation

/**
 * @fileoverview Export all of the public modules.
 */

// Browser-side shim, falls back to node default, extends the global.
require('setImmediate');

module.exports = {
  append     : require('./lib/append'),
  byteLength : require('./lib/byteLength'),
  filter     : require('./lib/filter'),
  fork       : require('./lib/fork'),
  invoke     : require('./lib/invoke'),
  join       : require('./lib/join'),
  map        : require('./lib/map'),
  prepend    : require('./lib/prepend'),
  replace    : require('./lib/replace'),
  split      : require('./lib/split'),
  tap        : require('./lib/tap')
};
