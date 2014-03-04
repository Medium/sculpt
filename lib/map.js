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
Mapper.prototype._safeTransform = function () {
  this.push(this.mapper.apply(null, arguments))
}

/**
 * Create a Mapper stream.
 * @param {Function} mapper
 * @return {Mapper}
 */
module.exports = function (mapper) {
  return new Mapper(mapper)
}
