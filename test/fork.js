// Copyright 2014. A Medium Corporation

var assert = require('assert')
var collect = require('./helpers/collect')
var fork = require('../').fork

describe('Fork', function () {
  it('Should fork to another writable stream', function (done) {
    var collector = collect()
    var forkedWritable = collect()
    var stream = fork(forkedWritable)

    stream.pipe(collector)
    stream.on('error', done)
    stream.on('end', function () {
      assert.deepEqual(['The Holy Roman Empire', 'roots for you'], forkedWritable.getObjects())
      assert.deepEqual(['The Holy Roman Empire', 'roots for you'], collector.getObjects())
      done()
    })

    stream.write('The Holy Roman Empire')
    stream.write('roots for you')
    stream.end()
  })

  it('Should bubble errors', function (done) {
    var stream = fork(collect())
    stream.on('error', function (err) {
      assert.equal(err.message, 'write after end')
      done()
    })

    stream.end('Hyannis Port is a ghetto, ')
    stream.end('out of Cape Cod tonight')
  })
})
