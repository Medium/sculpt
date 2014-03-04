// Copyright 2014. A Medium Corporation

/**
 * @file An implementaion of the Mapper stream.
 */
var map = require('./map')

/**
 * Creates a Mapper stream that appends a suffix to each chunk.
 *
 * @param {String} suffix Appended to each chunk
 * @return {Mapper}
 */
module.exports = function (suffix) {
  var mapper = function (chunk) {
    return chunk.toString() + suffix
  }

  return map(mapper)
}
