// Copyright 2014. A Medium Corporation

/**
 * @fileoverview A transform stream that splits chunks by separators.
 */
var map = require('./map')

/**
 * Create a Mapper stream that splits incoming data.
 * @param {String|RegExp} separator
 * @return {Mapper}
 */
module.exports = function (separator) {
  var cache = ''

  var mapper = function (chunk) {
    cache += chunk.toString()
    var parts = cache.split(separator)
    cache = parts.pop()
    return parts
  }

  var flush = function () {
    return [cache]
  }

  return map(mapper, flush).multi()
}
