// Copyright 2014. A Medium Corporation

var helpers = require('./helpers')

describe('Method', function () {
  it('Should call a method', function (done) {
    var collector = helpers.collect()
    var stream = helpers.sculpt.invoke('toString')

    stream.pipe(collector)
    stream.on('error', done)
    collector.on('end', function () {
      helpers.assert.strictEqual(collector.getObjects().shift(), '11')
      done()
    })

    stream.end(11)
  })

  it('Should emit an error if the method does not exist', function (done) {
    var collector = helpers.collect()
    var stream = helpers.sculpt.invoke('fake')

    stream.pipe(collector)
    stream.on('error', function (err) {
      helpers.assert.ok(err)
      helpers.assert.ok(err.message.indexOf('has no method'))
      done()
    })

    stream.end('A stranger walked in through the door')
  })

  it('Should pass arbitrary arguments to the method', function (done) {
    var collector = helpers.collect()
    var stream = helpers.sculpt.invoke('slice', 1)

    stream.pipe(collector)
    stream.on('error', done)
    collector.on('end', function () {
      helpers.assert.deepEqual(collector.getObjects().shift(), [
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
