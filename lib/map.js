// Copyright 2014. A Medium Corporation

/**
 * @file A transform stream that maps each chunk before it's written.
 */
var util = require('util')
var Base = require('./_base')

/**
 * Transform stream that applies a mapper function to each chunk and pushes
 * the mapped result.
 * @param {Function} mapper
 */
function Mapper(mapper) {
  this.mapper = mapper
  Base.call(this)
}
util.inherits(Mapper, Base)

/**
 * @override
 */
Mapper.prototype._safeTransform = function (chunk, enc, callback) {
  if (! this.isAsync()) {
    return this.push(this.mapper.apply(null, arguments))
  }

  this.mapper(chunk, function (err, data) {
    this.push(data)
    callback(err)
  }.bind(this))
}

/**
 * Create a Mapper stream.
 * @param {Function} mapper
 * @return {Mapper}
 */
module.exports = function (mapper) {
  return new Mapper(mapper)
}
