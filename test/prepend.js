// Copyright 2014. A Medium Corporation

var helpers = require('./helpers')

describe('Prepend', function () {
  it('Should add a prefix', function (done) {
    var collector = helpers.collect()
    var stream = helpers.sculpt.prepend('Why would you lie about ')

    stream.pipe(collector)
    stream.on('error', done)
    collector.on('end', function () {
      helpers.assert.deepEqual([
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
