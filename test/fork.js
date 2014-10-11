// Copyright 2014. A Medium Corporation

var helpers = require('./helpers')

describe('Fork', function () {
  it('Should fork to another writable stream', function (done) {
    var collector = helpers.collect()
    var forkedWritable = helpers.collect()
    var stream = helpers.sculpt.fork(forkedWritable)

    stream.pipe(collector)
    stream.on('error', done)
    collector.on('end', function () {
      helpers.assert.deepEqual(['The Holy Roman Empire', 'roots for you'], forkedWritable.getObjects())
      helpers.assert.deepEqual(['The Holy Roman Empire', 'roots for you'], collector.getObjects())
      done()
    })

    stream.write('The Holy Roman Empire')
    stream.write('roots for you')
    stream.end()
  })

  it('Should bubble errors', function (done) {
    var stream = helpers.sculpt.fork(helpers.collect())
    stream.on('error', function (err) {
      helpers.assert.equal(err.message, 'write after end')
      done()
    })

    stream.end('Hyannis Port is a ghetto, ')
    stream.end('out of Cape Cod tonight')
  })
})
