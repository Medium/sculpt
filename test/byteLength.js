// Copyright 2014. A Medium Corporation

var assert = require('assert')
var collect = require('./helpers/collect')
var byteLength = require('../').byteLength

function makeStreams(length) {
  var collector = collect()
  collector.on('data', function () {})
  var byteLengthStream = byteLength(length)
  byteLengthStream.pipe(collector)

  return {
    byteLength: byteLengthStream,
    collector: collector
  }
}

describe('Bytes', function () {
  it('Should output a single chunk if input is less than min bytes', function (done) {
    var streams = makeStreams(10)
    streams.collector.on('end', function () {
      var output = streams.collector.getObjects()
      assert.equal(1, output.length)
      assert.equal('Ya Hey', output[0])
      done()
    })

    streams.byteLength.end('Ya Hey')
  })

  it('Should output a single chunk if input is exactly min bytes', function (done) {
    var input = 'So I could never love you'
    var streams = makeStreams(Buffer.byteLength(input))

    streams.collector.on('end', function () {
      var output = streams.collector.getObjects()
      assert.equal(1, output.length)
      assert.equal(input, output[0])
      done()
    })

    streams.byteLength.end(input)
  })

  it('Should output Buffer objects', function (done) {
    var streams = makeStreams(10)
    streams.collector.on('end', function () {
      var output = streams.collector.getObjects()
      output.map(function (chunk) {
        assert.ok(Buffer.isBuffer(chunk))
      })
      done()
    })

    streams.byteLength.end('In spite of everything')
  })

  it('Should output chunks of the correct length', function (done) {
    var streams = makeStreams(5)
    streams.collector.on('end', function () {
      var output = streams.collector.getObjects()
      for (var i = 0; i < output.length - 1; i++) {
        assert.equal(output[i].length, 5)
      }

      // Last chunk can be any length
      assert.ok(output.pop().length <= 5)
      done()
    })

    streams.byteLength.write('In the dark of this place')
    streams.byteLength.write('There\'s the glow of your face')
    streams.byteLength.write('There\'s the dust on the screen')
    streams.byteLength.write('Of this broken machine')
    streams.byteLength.end()
  })

  it('Should split on byte length, not character count', function (done) {
    var streams = makeStreams(1)
    var multiByteChar = '\uDFFF'
    var byteLength = Buffer.byteLength(multiByteChar)

    streams.collector.on('end', function () {
      var chunks = streams.collector.getObjects()
      assert.equal(chunks.length, byteLength)
      done()
    })

    streams.byteLength.end(multiByteChar)
  })
})
