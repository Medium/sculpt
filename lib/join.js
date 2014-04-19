// Copyright 2014. A Medium Corporation

/**
 * @fileoverview A transform stream that joins incoming data with a separator
 */
var invoke = require('./invoke')

/**
 * Create a Mapper stream that joins incoming data.
 * @param {String} separator
 * @return {Mapper}
 */
module.exports = function (separator) {
  return invoke('join', separator)
}
