// Copyright 2014. A Medium Corporation

/**
 * @fileoverview A transform stream that maps each chunk before it's written.
 */
var util = require('util')
var Transform = require('stream').Transform

/**
 * Transform stream that applies a mapper function to each chunk and pushes
 * the mapped result.
 * @param {Function} mapper
 * @param {Function=} flush
 */
function Mapper(mapper, flush) {
  Transform.call(this, {
    objectMode: true,
    // Patch from 0.11.7
    // https://github.com/joyent/node/commit/ba72570eae938957d10494be28eac28ed75d256f
    highWaterMark: 16
  })

  this.mapper = mapper
  if (flush) {
    this._flush = flush
  }
}
util.inherits(Mapper, Transform)

/**
 * @override
 */
Mapper.prototype._transform = function () {
  var method = this.isAsync() ? '_asyncTransform' : '_syncTransform'
  this[method].apply(this, arguments)
}

/**
 * Apply a syncronous transformation.
 * @param {*} chunk
 * @param {String} enc
 * @param {Function} callback
 */
Mapper.prototype._syncTransform = function (chunk, enc, callback) {
  try {
    this.push(this.mapper(chunk))
    callback()
  } catch (e) {
    callback(e)
  }
}

/**
 * Apply an asyncronous transformation.
 * @param {*} chunk
 * @param {String} enc
 * @param {Function} callback
 */
Mapper.prototype._asyncTransform = function (chunk, enc, callback) {
  this.mapper(chunk, function (err, data) {
    this.push(data)
    callback(err)
  }.bind(this))
}

/**
 * Set the stream to be async. This is only relevant for map and filter streams, and not
 * for the built in streams that implement them.
 *
 * @return {Mapper}
 */
Mapper.prototype.async = function () {
  this._inAsyncMode = true
  return this
}

/**
 * Determine whether the stream is in async mode.
 *
 * @return {Boolean}
 */
Mapper.prototype.isAsync = function () {
  return !! this._inAsyncMode
}

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
 * @param {*} data Data to push. Should be an array when the stream is in multi mode.
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
 * Create a Mapper stream.
 * @param {Function} mapper
 * @param {Function=} flush
 * @return {Mapper}
 */
module.exports = function (mapper, flush) {
  return new Mapper(mapper, flush)
}

/**
 * Cache a single empty, immutable array. Used in streams that implement multi() to
 * avoid creating a new object each time we need an empty array.
 * @constant
 */
module.exports.EMPTY_ARRAY = Object.freeze([])
