// Copyright 2014. A Medium Corporation

var assert = require('assert')
var collect = require('./helpers/collect')
var invoke = require('../').invoke

describe('Method', function () {
  it('Should call a method', function (done) {
    var collector = collect()
    var stream = invoke('toString')

    stream.pipe(collector)
    stream.on('error', done)
    collector.on('end', function () {
      assert.strictEqual(collector.getObjects().shift(), '11')
      done()
    })

    stream.end(11)
  })

  it('Should emit an error if the method does not exist', function (done) {
    var collector = collect()
    var stream = invoke('fake')

    stream.pipe(collector)
    stream.on('error', function (err) {
      assert.ok(err)
      assert.ok(err.message.indexOf('has no method'))
      done()
    })

    stream.end('A stranger walked in through the door')
  })

  it('Should pass arbitrary arguments to the method', function (done) {
    var collector = collect()
    var stream = invoke('slice', 1)

    stream.pipe(collector)
    stream.on('error', done)
    collector.on('end', function () {
      assert.deepEqual(collector.getObjects().shift(), [
        'all',
        'apartments',
        'are',
        'pre-war'
      ])
      done()
    })

    stream.end([
      'Said',
      'all',
      'apartments',
      'are',
      'pre-war'
    ])
  })
})
