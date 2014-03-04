// Copyright 2014. A Medium Corporation

/**
 * @file A transform stream that removes chunks when the test function
 * returns a falsey value.
 */
var util = require('util')
var Base = require('./_base')

/**
 * Transform stream that passes on chunks that pass the test function's truth test.
 * @param {Function} fn Determines whether a chunk is kept or removed based on return value.
 * @constructor
 */
function Filterer(fn) {
  this.fn = fn
  Base.call(this)
}
util.inherits(Filterer, Base)

/**
 * @override
 */
Filterer.prototype._safeTransform = function (chunk, enc, callback) {
  if (! this.isAsync()) {
    return this.fn(chunk) && this.push(chunk)
  }

  this.fn(chunk, function (err, valid) {
    if (valid) {
      this.push(chunk)
    }

    callback(err)
  }.bind(this))
}

/**
 * Create a Filterer stream.
 * @param {Function} fn
 * @return {Filterer}
 */
module.exports = function (fn) {
  return new Filterer(fn)
}
