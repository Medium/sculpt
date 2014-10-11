// Copyright 2014. A Medium Corporation

var helpers = require('./helpers')

describe('Tap', function () {
  it('Should call a side effect function without changing data', function (done) {
    var collector = helpers.collect()
    var hannahs = 0
    var stream = helpers.sculpt.tap(function (line) {
      if (line.indexOf('Hannah') > -1) {
        hannahs++
      }
    })

    stream.pipe(collector)
    stream.on('error', done)
    collector.on('end', function () {
      helpers.assert.equal(hannahs, 2)
      done()
    })

    stream.write('In Santa Barbara, Hannah cried')
    stream.write('I miss those freezing beaches')
    stream.write('And I walked into town')
    stream.write('To buy some kindling for the fire')
    stream.write('Hannah tore the New York Times up into pieces')
    stream.end()
  })
})
