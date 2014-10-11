// Copyright 2014. A Medium Corporation

var helpers = require('./helpers')

describe('Replace', function () {
  it('Should replace a string with a string', function (done) {
    var collector = helpers.collect()
    var stream = helpers.sculpt.replace('ride on', 'it\'s a light on')

    stream.pipe(collector)
    stream.on('error', done)
    collector.on('end', function () {
      helpers.assert.equal('Baby baby baby baby it\'s a light on', collector.getObjects().pop())
      done()
    })

    stream.end('Baby baby baby baby ride on')
  })

  it('Should replace a regex with a string', function (done) {
    var collector = helpers.collect()
    var stream = helpers.sculpt.replace(/baby .+$/, 'it\'s a light on')

    stream.pipe(collector)
    stream.on('error', done)
    collector.on('end', function () {
      helpers.assert.equal('Baby it\'s a light on', collector.getObjects().pop())
      done()
    })

    stream.end('Baby baby baby baby ride on')
  })

  it('Should replace a regex with a function', function (done) {
    var collector = helpers.collect()
    // Capitalize the word after the last "baby"
    var stream = helpers.sculpt.replace(/baby(?! baby) (\w+)/, function (match, p1) {
      return 'baby ' + p1.toUpperCase()
    })

    stream.pipe(collector)
    stream.on('error', done)
    collector.on('end', function () {
      helpers.assert.equal('Baby baby baby baby RIDE on', collector.getObjects().pop())
      done()
    })

    stream.end('Baby baby baby baby ride on')
  })
})
