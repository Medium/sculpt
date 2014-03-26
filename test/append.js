// Copyright 2014. A Medium Corporation

var assert = require('assert')
var collect = require('./helpers/collect')
var append = require('../').append

describe('Append', function () {
  it('Should add a suffix', function (done) {
    var collector = collect()
    var stream = append('?')

    stream.pipe(collector)
    stream.on('error', done)
    collector.on('end', function () {
      assert.deepEqual([
        'Don\'t you know that it\'s insane?',
        'Don\'t you want to get out of Cap Code, out of Cape Code tonight?'
      ], collector.getObjects())
      done()
    })

    stream.write('Don\'t you know that it\'s insane')
    stream.write('Don\'t you want to get out of Cap Code, out of Cape Code tonight')
    stream.end()
  })
})
