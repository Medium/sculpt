// Copyright 2014. A Medium Corporation

var assert = require('assert')
var collect = require('./helpers/collect')
var map = require('../').map

describe('Map', function () {
  it('Should apply a mapper', function (done) {
    var collector = collect()
    var stream = map(function (line) {
      return line.toUpperCase()
    })

    stream.pipe(collector)
    stream.on('error', done)
    collector.on('end', function () {
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

  it('Should apply an async mapper', function (done) {
    var collector = collect()
    var stream = map(function (line, cb) {
      setImmediate(function () {
        cb(null, line.toUpperCase())
      })
    }).async()

    stream.pipe(collector)
    stream.on('error', done)
    collector.on('end', function () {
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

  it('Should apply a multi mapper', function (done) {
    var collector = collect()
    var i = 0
    var stream = map(function (line) {
      i++
      return [i, line]
    }).multi()

    stream.pipe(collector)
    stream.on('error', done)
    collector.on('end', function () {
      assert.deepEqual([
        1,
        'Why would you lie about how much coal you have?',
        2,
        'Why would you lie about anything at all?'
      ], collector.getObjects())
      done()
    })

    stream.write('Why would you lie about how much coal you have?')
    stream.write('Why would you lie about anything at all?')
    stream.end()
  })

  it('Should apply an async multi mapper', function (done) {
    var collector = collect()
    var i = 0
    var stream = map(function (line, cb) {
      setImmediate(function () {
        i++
        cb(null, [i, line])
      })
    }).async().multi()

    stream.pipe(collector)
    stream.on('error', done)
    collector.on('end', function () {
      assert.deepEqual([
        1,
        'Why would you lie about how much coal you have?',
        2,
        'Why would you lie about anything at all?'
      ], collector.getObjects())
      done()
    })

    stream.write('Why would you lie about how much coal you have?')
    stream.write('Why would you lie about anything at all?')
    stream.end()
  })
})
