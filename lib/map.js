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
 * Set the stream to allow pushing multiple values per call. This is only relevant for map streams,
 * and not for the built in streams that implement them.
 *
 * @return {Mapper}
 */
Mapper.prototype.multi = function () {
  this._inMultiMode = true
  return this
}

/**
 * Determine whether the stream is in multi mode.
 *
 * @return {Boolean}
 */
Mapper.prototype.isMulti = function () {
  return !! this._inMultiMode
}

/**
 * Wrapper for the core readable stream's push method. Allows pushing multiple values in
 * a single call for streams in multi mode.
 *
 * @override
 * @param {String|Buffer|Array.<String>|Array.<Buffer>} data Data to push. Should be an
 *   array when the stream is in multi mode.
 */
Mapper.prototype.push = function (data) {
  var push = Mapper.super_.prototype.push

  // The null condition here is because internally Node writes a null value to indicate
  // the end of the stream.
  if (! this.isMulti() || data === null) {
    push.call(this, data)
  } else {
    data.forEach(push.bind(this))
  }
}

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
