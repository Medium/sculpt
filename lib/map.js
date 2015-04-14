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
 * @param {Function=} flusher
 */
function Mapper(mapper, flusher) {
  Transform.call(this, {
    objectMode: true,
    // Patch from 0.11.7
    // https://github.com/joyent/node/commit/ba72570eae938957d10494be28eac28ed75d256f
    highWaterMark: 16
  })

  this.mapper = mapper
  this.flusher = flusher
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
 * @override
 */
Mapper.prototype._flush = function (callback) {
  // If we don't have a flusher, bail.
  if (! this.flusher) return callback()

  var method = this.isAsync() ? '_asyncFlush' : '_syncFlush'
  this[method].call(this, callback)
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
    if (err) return callback(err)

    this.push(data)
    callback(null)
  }.bind(this))
}

/**
 * Synchronously flush the stream.
 * @param {Function} callback
 */
Mapper.prototype._syncFlush = function (callback) {
  try {
    this.push(this.flusher())
    callback()
  } catch (e) {
    callback(e)
  }
}

/**
 * Asynchronously flush the stream.
 * @param {Function} callback
 */
Mapper.prototype._asyncFlush = function (callback) {
  this.flusher(function (err, data) {
    if (err) return callback(err)

    this.push(data)
    callback(null)
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
 * Set the stream to ignore undefined values when they are written. This helps avoid accidentally
 * signaling the end of a stream.
 *
 * @return {Mapper}
 */
Mapper.prototype.ignoreUndefined = function () {
  this._ignoringUndefined = true
  return this
}

/**
 * Determing whether the stream is ignoring undefined values.
 *
 * @return {Boolean}
 */
Mapper.prototype.isIgnoringUndefined = function () {
  return !! this._ignoringUndefined
}

/**
 * Wrapper for the core readable stream's push method. Allows pushing multiple values in
 * a single call for streams in multi mode.
 *
 * @override
 * @param {*} data Data to push. Should be an array when the stream is in multi mode.
 * @return {Boolean}
 */
Mapper.prototype.push = function (data) {
  var push = Mapper.super_.prototype.push

  // If we're in multi-mode but get undefined while we're ignoring undefined values, bail.
  // In this case we don't give Node a chance to tell us whether or not the stream is in a
  // state to accept more pushes. Since we didn't add any data to the buffer, it's as safe
  // to push more data as it was to push this one. If it's not safe to push more data then
  // it wasn't safe to push this data, so you're probably ignoring this value anyway so
  // who cares what we return. ¯\_(ツ)_/¯
  if (this._shouldSkipPush(data)) {
    return true
  }

  // The null condition here is because internally Node writes a null value to indicate
  // the end of the stream.
  if (! this.isMulti() || data === null) {
    return push.call(this, data)
  } else {
    var needMoreData = false
    for (var i = 0; i < data.length; ++i) {
      needMoreData = push.call(this, data[i])
    }
    return needMoreData
  }
}

/**
 * Determine whether we should skip the push step for this chunk of data.
 *
 * @param {*} data
 * @return {Boolean}
 */
Mapper.prototype._shouldSkipPush = function (data) {
  return data === undefined && this.isIgnoringUndefined()
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
 * @type {Array}
 * @constant
 */
module.exports.EMPTY_ARRAY = Object.freeze([])
