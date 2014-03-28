// Copyright 2014. A Medium Corporation

var assert = require('assert')
var collect = require('./helpers/collect')
var join = require('../').join

describe('Join', function () {
  it('Should join with a separator', function (done) {
    var collector = collect()
    var stream = join(' about ')

    stream.pipe(collector)
    stream.on('error', done)
    collector.on('end', function () {
      assert.deepEqual([
        'Why would you lie about how much coal you have?',
        'Why would you lie about something dumb like that?'
      ], collector.getObjects())
      done()
    })

    stream.write(['Why would you lie', 'how much coal you have?'])
    stream.write(['Why would you lie', 'something dumb like that?'])
    stream.end()
  })
})
