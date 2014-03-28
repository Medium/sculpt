// Copyright 2014. A Medium Corporation

var assert = require('assert')
var collect = require('./helpers/collect')
var split = require('../').split

describe('Split', function () {
  it('Should split on a string', function (done) {
    var collector = collect()
    var stream = split('\n')

    stream.pipe(collector)
    stream.on('error', done)
    collector.on('end', function () {
      assert.deepEqual([
        'I took your counsel and came to ruin',
        'Leave me to myself, leave me to myself'
      ], collector.getObjects())
      done()
    })

    stream.end('I took your counsel and came to ruin\nLeave me to myself, leave me to myself')
  })

  it('Should split on a regex', function (done) {
    var collector = collect()
    var stream = split(/,\s+/)

    stream.pipe(collector)
    stream.on('error', done)
    collector.on('end', function () {
      assert.deepEqual([
        'Looked up full of fear',
        'trapped beneath the chandelier'
      ], collector.getObjects())
      done()
    })

    stream.end('Looked up full of fear,    trapped beneath the chandelier')
  })
})
