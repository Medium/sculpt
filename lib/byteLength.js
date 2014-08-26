// Copyright 2014. A Medium Corporation

/**
 * @fileoverview A transform stream that splits streams into chunks of the same size in bytes.
 * Buffer splitting is based on https://github.com/substack/rolling-hash.
 */
var map = require('./map')

/**
 * Create a Mapper stream that splits incoming data into equal size chunks. The last buffer will
 * likely be smaller than the size, based on whatever is left. Length is always calculated as
 * Buffers, output is always Buffer objects.
 * @param {Number} length
 * @return {Mapper}
 */
module.exports = function (length) {
  var cache = []
  var cachedBytes = 0

  var transform = function (buf) {
    // Make sure we're always dealing with Buffers
    if (! Buffer.isBuffer(buf)) {
      buf = new Buffer(buf)
    }

    // Check to see if we have enough data to push out to consumers
    // If not, cache this chunk and move on.
    if (buf.length + cachedBytes < length) {
      cache.push(buf)
      cachedBytes += buf.length
      return map.EMPTY_ARRAY
    }

    // Check to see if we have any previously cached data to combine with this chunk
    if (cachedBytes) {
      cache.push(buf)
      buf = Buffer.concat(cache)
      cachedBytes = 0
      cache.length = 0
    }

    // Build an array of chunks that are the desired length
    var correctLengthChunks = []
    for (var i = 0; i <= buf.length - length; i += length) {
      correctLengthChunks.push(buf.slice(i, i + length))
    }

    // Cache any leftover data
    var extraBytes = buf.length % length
    if (extraBytes) {
      cache.push(buf.slice(buf.length - extraBytes))
      cachedBytes += extraBytes
    }

    return correctLengthChunks
  }

  var flush = function (cb) {
    this.push(cache)
    cb()
  }

  return map(transform, flush).multi()
}


/**
 * Kilobyte in bytes
 * @type {number}
 * @constant
 */
exports.KB_IN_BYTES = 1024

/**
 * Megabyte in bytes
 * @type {number}
 * @constant
 */
exports.MB_IN_BYTES = Math.pow(exports.KB_IN_BYTES, 2)

/**
 * Gigabyte in bytes
 * @type {number}
 * @constant
 */
exports.GB_IN_BYTES = Math.pow(exports.MB_IN_BYTES, 2)
