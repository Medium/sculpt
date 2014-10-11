// Copyright 2014. A Medium Corporation

var helpers = require('./helpers')

// Remove all references to New Jersey
function noJersey(item) {
  return item.indexOf('Garden State') === -1
}

describe('Filter', function () {
  it('Should allow objects that pass', function (done) {
    var collector = helpers.collect()
    var stream = helpers.sculpt.filter(noJersey)

    stream.pipe(collector)
    stream.on('error', done)
    collector.on('end', function () {
      helpers.assert.equal('Out of Cape Cod tonight', collector.getObjects().pop())
      done()
    })

    stream.end('Out of Cape Cod tonight')
  })

  it('Should allow objects that pass async', function (done) {
    var collector = helpers.collect()
    var stream = helpers.sculpt.filter(function (chunk, cb) {
      setTimeout(function () {
        cb(null, noJersey(chunk))
      }, 1)
    }).async()

    stream.pipe(collector)
    stream.on('error', done)
    collector.on('end', function () {
      helpers.assert.equal('Out of Cape Cod tonight', collector.getObjects().pop())
      done()
    })

    stream.end('Out of Cape Cod tonight')
  })

  it('Should block objects that do not pass', function (done) {
    var collector = helpers.collect()
    var stream = helpers.sculpt.filter(noJersey)

    stream.pipe(collector)
    stream.on('error', done)
    collector.on('end', function () {
      helpers.assert.deepEqual([], collector.getObjects())
      done()
    })

    stream.end('All the way to the Garden State')
  })

  it('Should block objects that do not pass async', function (done) {
    var collector = helpers.collect()
    var stream = helpers.sculpt.filter(function (chunk, cb) {
      setTimeout(function () {
        cb(null, noJersey(chunk))
      }, 1)
    }).async()

    stream.pipe(collector)
    stream.on('error', done)
    collector.on('end', function () {
      helpers.assert.deepEqual([], collector.getObjects())
      done()
    })

    stream.end('All the way to the Garden State')
  })
})
