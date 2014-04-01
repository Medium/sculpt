// Copyright 2014. A Medium Corporation

/**
 * @fileoverview A transform stream that forks written values to a writable stream.
 */
var map = require('./map')

/**
 * Create a transform stream that forks incoming writes.
 * @param {stream.Writable} writable
 * @return {Mapper}
 */
module.exports = function (writable) {
  var stream = map(function (data, cb) {
    writable.write(data, function (err) {
      cb(err, data)
    })
  }).async()

  // Bubble errors from the forked stream to the parent.
  writable.on('error', function () {
    var args = Array.prototype.slice.call(arguments)
    stream.emit.apply(stream, ['error'].concat(args))
  })

  return stream
}
