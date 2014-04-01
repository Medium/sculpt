// Copyright 2014. A Medium Corporation

/**
 * @fileoverview A transform stream that removes chunks when the test function
 * returns a falsey value.
 */
var map = require('./map')

/**
 * Transform stream that passes on chunks that pass the test function's truth test.
 * @param {Function} fn Determines whether a chunk is kept or removed based on return value.
 * @return {Mapper}
 */
module.exports = function (fn) {
  return map(function (data, callback) {
    if (! this.isAsync()) {
      var syncResult = fn(data) ? [data] : map.EMPTY_ARRAY
      return syncResult
    }

    fn(data, function (err, valid) {
      var asyncResult = valid ? [data] : map.EMPTY_ARRAY
      callback(err, asyncResult)
    })
  }).multi()
}
