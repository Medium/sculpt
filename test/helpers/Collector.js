// Copyright 2014. A Medium Corporation

/**
 * @file A simple writeable stream that collects objects from
 * a readable stream.
 */
var stream = require('stream')
var util = require('util')

/**
 * A simple writable stream that just collects objects from an up stream.
 */
var ObjectCollectStream = function () {
  stream.Writable.call(this, {objectMode: true})
  this._objects = []
}
util.inherits(ObjectCollectStream, stream.Writable)

/**
 * @override
 */
ObjectCollectStream.prototype._write = function (object, encoding, callback) {
  this._objects.push(object)
  callback()
}

/**
 * Get an array of objects that have been piped to this stream.
 *
 * @return {Array.<Object>}
 */
ObjectCollectStream.prototype.getObjects = function () {
  return this._objects
}

/**
 * Create an instance of ObjectCollectStream
 * @return {ObjectCollectStream}
 */
module.exports = ObjectCollectStream
