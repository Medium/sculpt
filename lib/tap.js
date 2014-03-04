// Copyright 2014. A Medium Corporation

/**
 * @file A transform stream that calls a function for each chunk but
 * does not change the streaming data.
 */
var map = require('./map')

/**
 * Create a Mapper stream that calls the side effect function and then
 * passes on the unchanged chunk.
 * @param {Function} fn
 * @return {Mapper}
 */
module.exports = function (fn) {
  var mapper = function (chunk) {
    fn(chunk)
    return chunk
  }

  return map(mapper)
}
