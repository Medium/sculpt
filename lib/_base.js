// Copyright 2014. A Medium Corporation

/**
 * @file A base class to create a transform stream in object mode and
 * pass errors to the _transform() callback.
 */
var Transform = require('stream').Transform
var util = require('util')

module.exports = ObjectStream

/**
 * Object mode transformd stream.
 *
 * @constructor
 * @param {Object} opts
 */
function ObjectStream() {
  Transform.call(this, {objectMode: true})
}
util.inherits(ObjectStream, Transform)

/**
 * Set the stream to be async. This is only relevant for map and filter streams, and not
 * for the built in streams that implement them.
 *
 * @return {ObjectStream}
 */
ObjectStream.prototype.async = function () {
  this._inAsyncMode = true
  return this
}

/**
 * Determine whether the stream is in async mode.
 *
 * @return {Boolean}
 */
ObjectStream.prototype.isAsync = function () {
  return !! this._inAsyncMode
}

/**
 * @override
 */
ObjectStream.prototype._transform = function (chunk, enc, callback) {
  var maybeSyncCallback = function () {
    if (this.isAsync()) return
    callback.apply(null, arguments)
  }.bind(this)

  try {
    this._safeTransform(chunk, enc, callback)
    maybeSyncCallback()
  } catch (err) {
    maybeSyncCallback(err)
  }
}

/**
 * Transform incoming data. Uncaught errors are provided as an error argument to
 * the _transform() callback.
 *
 * @abstract
 */
ObjectStream.prototype._safeTransform = function () {
  throw new Error('Child classes should implement _safeTransform() or override _transform()')
}
