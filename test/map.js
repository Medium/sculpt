// Copyright 2014. A Medium Corporation

var assert = require('assert')
var Collector = require('./helpers/Collector')
var map = require('../').map

describe('Map', function () {
  it('Should apply a mapper', function (done) {
    var collector = new Collector()
    var stream = map(function (line) {
      return line.toUpperCase()
    })

    stream.pipe(collector)
    stream.on('error', done)
    stream.on('end', function () {
      assert.deepEqual([
        'WHY WOULD YOU LIE ABOUT HOW MUCH COAL YOU HAVE?',
        'WHY WOULD YOU LIE ABOUT ANYTHING AT ALL?'
      ], collector.getObjects())
      done()
    })

    stream.write('Why would you lie about how much coal you have?')
    stream.write('Why would you lie about anything at all?')
    stream.end()
  })
})
