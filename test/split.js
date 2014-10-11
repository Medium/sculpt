// Copyright 2014. A Medium Corporation

var helpers = require('./helpers')

describe('Split', function () {
  it('Should split on a string', function (done) {
    var collector = helpers.collect()
    var stream = helpers.sculpt.split('\n')

    stream.pipe(collector)
    stream.on('error', done)
    collector.on('end', function () {
      helpers.assert.deepEqual([
        'I took your counsel and came to ruin',
        'Leave me to myself, leave me to myself'
      ], collector.getObjects())
      done()
    })

    stream.end('I took your counsel and came to ruin\nLeave me to myself, leave me to myself')
  })

  it('Should split on a regex', function (done) {
    var collector = helpers.collect()
    var stream = helpers.sculpt.split(/,\s+/)

    stream.pipe(collector)
    stream.on('error', done)
    collector.on('end', function () {
      helpers.assert.deepEqual([
        'Looked up full of fear',
        'trapped beneath the chandelier'
      ], collector.getObjects())
      done()
    })

    stream.end('Looked up full of fear,    trapped beneath the chandelier')
  })
})
