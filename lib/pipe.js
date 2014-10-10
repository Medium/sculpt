// Copyright 2014. A Medium Corporation

/**
 * @fileoverview Centralize error handling for a series of piped streams.
 */

/**
 * Pipe a series of streams together and bubble any errors to the last stream in the series.
 * The first stream should implement stream.Readable, the last should implement stream.Writable,
 * and any in between should implement stream.Duplex.
 *
 * @param {...Stream|Array.<Stream>} streams
 * @return {Stream} The last stream in the series, for chaining.
 */
module.exports = function (streams) {
  if (! Array.isArray(streams)) {
    streams = Array.prototype.slice.call(arguments, 0)
  }

  var len = streams.length
  var last = streams[len - 1]

  if (! last) {
    throw new Error('Must provide streams')
  }


  for (var i = 1; i < len; i++) {
    streams[i - 1]
      .on('error', last.emit.bind(last, 'error'))
      .pipe(streams[i])
  }

  return last
}
