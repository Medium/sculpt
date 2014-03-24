var cameron = require('cameron-streams')
var sculpt = require('./index')

setInterval(function () {
  var size = process.memoryUsage().rss / Math.pow(1024, 2)
  console.log(Math.floor(size))
}, 1000).unref()

function onerr(err) {
  console.error(err)
  console.trace()
  process.exit(1)
}

var totalSize = 0
var sculptStream = sculpt.map(function (data, cb) {
    console.log(sculptStream._writableState)
    setTimeout(function () {
      var err
      // if (Math.random() > 0.95) {
      //   err = new Error('Big number')
      // }
      cb(err, data)
    }, 1)
  }).async()
cameron.random(Math.floor(Math.pow(1024, 3))).on('error', onerr)
  .pipe(sculptStream).on('error', onerr)
  .pipe(cameron.emitter()).on('error', onerr)
    .on('write', function (c) {
      totalSize += c.length
      // console.log('output', totalSize / Math.pow(1024, 3))
    })
    .on('finish', function () {
      console.log('done')
    })
