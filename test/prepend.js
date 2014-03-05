// Copyright 2014. A Medium Corporation

var assert = require('assert')
var collect = require('./helpers/collect')
var prepend = require('../').prepend

describe('Prepend', function () {
  it('Should add a prefix', function (done) {
    var collector = collect()
    var stream = prepend('Why would you lie about ')

    stream.pipe(collector)
    stream.on('error', done)
    stream.on('end', function () {
      assert.deepEqual([
        'Why would you lie about how much coal you have?',
        'Why would you lie about something dumb like that?',
        'Why would you lie about anything at all?'
      ], collector.getObjects())
      done()
    })

    stream.write('how much coal you have?')
    stream.write('something dumb like that?')
    stream.write('anything at all?')
    stream.end()
  })
})
