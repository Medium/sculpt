// Copyright 2014. A Medium Corporation

/**
 * @file A transform stream that splits chunks by separators.
 */
var util = require('util')
var Base = require('./_base')

/**
 * Transform stream that pushes a chunk for each split part of the incoming stream.
 * @param {String|RegExp} separator
 */
function Splitter(separator) {
  this._separator = separator
  this._cache = ''
  Base.call(this)
}
util.inherits(Splitter, Base)

/**
 * @override
 */
Splitter.prototype._transform = function (chunk, encoding, callback) {
  this._cache += chunk.toString()

  var parts = this._cache.split(this._separator)
  this._cache = parts.pop()

  parts.forEach(this.push.bind(this))

  callback()
}

/**
 * @override
 */
Splitter.prototype._flush = function (callback) {
  this.push(this._cache)
  callback()
}

/**
 * Create a Splitter stream.
 * @param {String|RegExp} separator
 * @return {Splitter}
 */
module.exports = function (separator) {
  return new Splitter(separator)
}
