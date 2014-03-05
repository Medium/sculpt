// Copyright 2014. A Medium Corporation

var assert = require('assert')
var collect = require('./helpers/collect')
var tap = require('../').tap

describe('Tap', function () {
  it('Should call a side effect function without changing data', function (done) {
    var collector = collect()
    var hannahs = 0
    var stream = tap(function (line) {
      if (line.indexOf('Hannah') > -1) {
        hannahs++
      }
    })

    stream.pipe(collector)
    stream.on('error', done)
    stream.on('end', function () {
      assert.equal(hannahs, 2)
      done()
    })

    stream.write('In Santa Barbara, Hannah cried')
    stream.write('I miss those freezing beaches')
    stream.write('And I walked into town')
    stream.write('To buy some kindling for the fire')
    stream.write('Hannah tore the New York Times up into pieces')
    stream.end()
  })
})
