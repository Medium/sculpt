// Copyright 2014. A Medium Corporation

var assert = require('assert')
var Collector = require('./helpers/Collector')
var replace = require('../').replace

describe('Replace', function () {
  it('Should replace a string with a string', function (done) {
    var collector = new Collector()
    var stream = replace('ride on', 'it\'s a light on')

    stream.pipe(collector)
    stream.on('error', done)
    stream.on('end', function () {
      assert.equal('Baby baby baby baby it\'s a light on', collector.getObjects().pop())
      done()
    })

    stream.end('Baby baby baby baby ride on')
  })

  it('Should replace a regex with a string', function (done) {
    var collector = new Collector()
    var stream = replace(/baby .+$/, 'it\'s a light on')

    stream.pipe(collector)
    stream.on('error', done)
    stream.on('end', function () {
      assert.equal('Baby it\'s a light on', collector.getObjects().pop())
      done()
    })

    stream.end('Baby baby baby baby ride on')
  })

  it('Should replace a regex with a function', function (done) {
    var collector = new Collector()
    // Capitalize the word after the last "baby"
    var stream = replace(/baby(?! baby) (\w+)/, function (match, p1) {
      return 'baby ' + p1.toUpperCase()
    })

    stream.pipe(collector)
    stream.on('error', done)
    stream.on('end', function () {
      assert.equal('Baby baby baby baby RIDE on', collector.getObjects().pop())
      done()
    })

    stream.end('Baby baby baby baby ride on')
  })
})
