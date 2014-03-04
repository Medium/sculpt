// Copyright 2014. A Medium Corporation

var assert = require('assert')
var Collector = require('./helpers/Collector')
var filter = require('../').filter

// Remove all references to New Jersey
function noJersey(item) {
  return item.indexOf('Garden State') === -1
}

describe('Filter', function () {
  it('Should allow objects that pass', function (done) {
    var collector = new Collector()
    var stream = filter(noJersey)

    stream.pipe(collector)
    stream.on('error', done)
    stream.on('end', function () {
      assert.equal('Out of Cape Cod tonight', collector.getObjects().pop())
      done()
    })

    stream.end('Out of Cape Cod tonight')
  })

  it('Should allow objects that pass async', function (done) {
    var collector = new Collector()
    var stream = filter(function (chunk, cb) {
      setImmediate(function () {
        cb(null, noJersey(chunk))
      })
    }).async()

    stream.pipe(collector)
    stream.on('error', done)
    stream.on('end', function () {
      assert.equal('Out of Cape Cod tonight', collector.getObjects().pop())
      done()
    })

    stream.end('Out of Cape Cod tonight')
  })

  it('Should block objects that do not pass', function (done) {
    var collector = new Collector()
    var stream = filter(noJersey)

    stream.pipe(collector)
    stream.on('error', done)
    stream.on('end', function () {
      assert.deepEqual([], collector.getObjects())
      done()
    })

    stream.end('All the way to the Garden State')
  })

  it('Should block objects that do not pass async', function (done) {
    var collector = new Collector()
    var stream = filter(function (chunk, cb) {
      setImmediate(function () {
        cb(null, noJersey(chunk))
      })
    }).async()

    stream.pipe(collector)
    stream.on('error', done)
    stream.on('end', function () {
      assert.deepEqual([], collector.getObjects())
      done()
    })

    stream.end('All the way to the Garden State')
  })
})
