// Copyright 2014. A Medium Corporation

/**
 * @fileoverview A transform stream that calls a method on each incoming chunk.
 */
var map = require('./map')

/**
 * Create a Mapper stream that calls a method on each chunk.
 * @param {String} methodName
 * @param {...*=} args
 * @return {Mapper}
 */
module.exports = function (methodName, args) {
  // All arguments after the method name
  args = Array.prototype.slice.call(arguments, 1)

  return map(function (chunk) {
    return chunk[methodName].apply(chunk, args)
  })
}
