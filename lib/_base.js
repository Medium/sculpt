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
 */
function ObjectStream() {
  Transform.call(this, {objectMode: true})
}
util.inherits(ObjectStream, Transform)

/**
 * @override
 */
ObjectStream.prototype._transform = function (chunk, enc, callback) {
  try {
    this._safeTransform.apply(this, arguments)
    callback()
  } catch (err) {
    callback(err)
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
