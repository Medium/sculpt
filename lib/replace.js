// Copyright 2014. A Medium Corporation

/**
 * @file A transform stream that calls .replace() on each chunk.
 */
var map = require('./map')

/**
 * Create a Mapper stream that replaces values in each chunk.
 * @param {String|RegExp} find
 * @param  {String|RegExp} replace
 * @return {Mapper}
 */
module.exports = function (find, replace) {
  var mapper = function (chunk) {
    return chunk.toString().replace(find, replace)
  }

  return map(mapper)
}
