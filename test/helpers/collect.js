// Copyright 2014. A Medium Corporation

/**
 * @file A simple transform stream that just collects incoming objects.
 */
var sculpt = require('../../index')

/**
 * Create a collector stream.
 * @return {stream.Transform}
 */
module.exports = function () {
  var objects = []
  var collector = sculpt.tap(objects.push.bind(objects))

  // Make sure it consumes the incoming data
  collector.on('data', function () {})

  collector.getObjects = function () {
    return objects
  }

  return collector
}
