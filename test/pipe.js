var assert = require('assert')
var collect = require('./helpers/collect')
var sculpt = require('../')

describe('Pipe', function () {
  it('Should return the last stream from an array', function () {
    var target = sculpt.tap()
    var result = sculpt.pipe([sculpt.tap(), target])
    assert.equal(target, result)
  })

  it('Should return the last stream from a splat', function () {
    var target = sculpt.tap()
    var result = sculpt.pipe(sculpt.tap(), target)
    assert.equal(target, result)
  })

  it('Should throw if no arguments are passed', function () {
    assert.throws(sculpt.pipe.bind(sculpt))
  })

  it('Should throw if an empty array is passed', function () {
    assert.throws(sculpt.pipe.bind(sculpt, []))
  })

  it('Should collect errors from an array', function (done) {
    var collector = collect()
    var start = sculpt.map(function (data) {
      return data
    })

    var finish = sculpt.map(function () {
      throw new Error('Oops')
    })

    sculpt.pipe([start, finish])
      .on('error', function (err) {
        assert.ok(err)
        assert.equal(err.message, 'Oops')
        done()
      })
      .pipe(collector)

    start.end('Hello')
  })

  it('Should collect errors from a splat', function (done) {
    var collector = collect()
    var start = sculpt.map(function (data) {
      return data
    })

    var finish = sculpt.map(function () {
      throw new Error('Oops')
    })

    sculpt.pipe(start, finish)
      .on('error', function (err) {
        assert.ok(err)
        assert.equal(err.message, 'Oops')
        done()
      })
      .pipe(collector)

    start.end('Hello')
  })
})
