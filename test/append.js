// Copyright 2014. A Medium Corporation

var helpers = require('./helpers')

describe('Append', function () {
  it('Should add a suffix', function (done) {
    var collector = helpers.collect()
    var stream = helpers.sculpt.append('?')

    stream.pipe(collector)
    stream.on('error', done)
    collector.on('end', function () {
      helpers.assert.deepEqual([
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
