// Copyright 2014. A Medium Corporation

/**
 * @fileoverview A transform stream that prepends a prefix to each chunk.
 */
var map = require('./map')

/**
 * Create a Mapper stream that prefixes chunks.
 * @param {String} prefix
 * @return {Mapper}
 */
module.exports = function (prefix) {
  var mapper = function (chunk) {
    return prefix + chunk.toString()
  }

  return map(mapper)
}
