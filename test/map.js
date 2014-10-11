// Copyright 2014. A Medium Corporation

var helpers = require('./helpers')

describe('Map', function () {
  it('Should apply a mapper', function (done) {
    var collector = helpers.collect()
    var stream = helpers.sculpt.map(function (line) {
      return line.toUpperCase()
    })

    stream.pipe(collector)
    stream.on('error', done)
    collector.on('end', function () {
      helpers.assert.deepEqual([
        'WHY WOULD YOU LIE ABOUT HOW MUCH COAL YOU HAVE?',
        'WHY WOULD YOU LIE ABOUT ANYTHING AT ALL?'
      ], collector.getObjects())
      done()
    })

    stream.write('Why would you lie about how much coal you have?')
    stream.write('Why would you lie about anything at all?')
    stream.end()
  })

  it('Should apply an async mapper', function (done) {
    var collector = helpers.collect()
    var stream = helpers.sculpt.map(function (line, cb) {
      setTimeout(function () {
        cb(null, line.toUpperCase())
      }, 1)
    }).async()

    stream.pipe(collector)
    stream.on('error', done)
    collector.on('end', function () {
      helpers.assert.deepEqual([
        'WHY WOULD YOU LIE ABOUT HOW MUCH COAL YOU HAVE?',
        'WHY WOULD YOU LIE ABOUT ANYTHING AT ALL?'
      ], collector.getObjects())
      done()
    })

    stream.write('Why would you lie about how much coal you have?')
    stream.write('Why would you lie about anything at all?')
    stream.end()
  })

  it('Should apply a multi mapper', function (done) {
    var collector = helpers.collect()
    var i = 0
    var stream = helpers.sculpt.map(function (line) {
      i++
      return [i, line]
    }).multi()

    stream.pipe(collector)
    stream.on('error', done)
    collector.on('end', function () {
      helpers.assert.deepEqual([
        1,
        'Why would you lie about how much coal you have?',
        2,
        'Why would you lie about anything at all?'
      ], collector.getObjects())
      done()
    })

    stream.write('Why would you lie about how much coal you have?')
    stream.write('Why would you lie about anything at all?')
    stream.end()
  })

  it('Should apply an async multi mapper', function (done) {
    var collector = helpers.collect()
    var i = 0
    var stream = helpers.sculpt.map(function (line, cb) {
      setTimeout(function () {
        i++
        cb(null, [i, line])
      }, 1)
    }).async().multi()

    stream.pipe(collector)
    stream.on('error', done)
    collector.on('end', function () {
      helpers.assert.deepEqual([
        1,
        'Why would you lie about how much coal you have?',
        2,
        'Why would you lie about anything at all?'
      ], collector.getObjects())
      done()
    })

    stream.write('Why would you lie about how much coal you have?')
    stream.write('Why would you lie about anything at all?')
    stream.end()
  })

  it('Should not throw on pushing data when async streams have an error', function (done) {
    var stream = helpers.sculpt.map(function (data, callback) {
      callback(new Error('This stream never works'))
    }).async().multi()

    stream.on('error', function (err) {
      helpers.assert.ok(err)
      done()
    })

    stream.on('end', function () {
      done(new Error('This stream should error before it ends'))
    })

    stream.end('I see a Mansard roof through the trees')
  })

  it('Should be able to ignore undefined values', function (done) {
    var stream = helpers.sculpt.map(function (num) {
      return num % 2 ? num : undefined
    }).ignoreUndefined()
    var collector = helpers.collect()

    stream.on('error', done)
    collector.on('error', done)
    stream.pipe(collector)

    stream.write(1)
    stream.write(2)
    stream.write(3)
    stream.write(4)
    stream.end()

    collector.on('end', function () {
      helpers.assert.deepEqual([1, 3], collector.getObjects())
      done()
    })
  })

  it('Should flush', function (done) {
    var stream = helpers.sculpt.map(function (i) {
      return i
    }, function () {
      return 'Finish'
    })
    var collector = helpers.collect()

    stream.on('error', done)
    collector.on('error', done)
    stream.pipe(collector)

    stream.end('Start')

    collector.on('end', function () {
      helpers.assert.deepEqual(['Start', 'Finish'], collector.getObjects())
      done()
    })
  })
})
