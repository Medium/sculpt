// Copyright 2014. A Medium Corporation

/**
 * @fileoverview A transform stream that joins incoming data with a separator
 */
var map = require('./map')

/**
 * Create a Mapper stream that joins incoming data.
 * @param {String} separator
 * @return {Mapper}
 */
module.exports = function (separator) {
  var mapper = function (arr) {
    return arr.join(separator)
  }

  return map(mapper)
}
