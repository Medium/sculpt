// Copyright 2014. A Medium Corporation

/**
 * @file A transform stream that forks written values to a writable stream.
 */
var util = require('util')
var Base = require('./_base')

/**
 * Create a transform stream that forks incoming writes.
 * @param {stream.Writable} writable
 * @return {ObjectStream}
 */
module.exports = function (writable) {
  function Fork() {
    Base.call(this)
  }
  util.inherits(Fork, Base)

  Fork.prototype._transform = function (chunk, enc, callback) {
    var wrappedCallback = function () {
      this.push(chunk)
      callback.apply(null, arguments)
    }.bind(this)

    writable.write(chunk, enc, wrappedCallback)
  }

  var fork = new Fork()
  writable.on('error', function () {
    var args = Array.prototype.slice.call(arguments)
    fork.emit.apply(fork, ['error'].concat(args))
  })

  return fork
}
