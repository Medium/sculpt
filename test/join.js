// Copyright 2014. A Medium Corporation

var helpers = require('./helpers')

describe('Join', function () {
  it('Should join with a separator', function (done) {
    var collector = helpers.collect()
    var stream = helpers.sculpt.join(' about ')

    stream.pipe(collector)
    stream.on('error', done)
    collector.on('end', function () {
      helpers.assert.deepEqual([
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
