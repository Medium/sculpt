// Copyright 2014. A Medium Corporation

/**
 * @fileoverview A transform stream that calls .replace() on each chunk.
 */
var map = require('./map')

/**
 * Create a Mapper stream that replaces values in each chunk.
 * @param {String|RegExp} find
 * @param  {String|Function} replace
 * @param {String} [flags]
 * @return {Mapper}
 */
module.exports = function (find, replace, flags) {
  var coerceRegExp = function (expression, flags) {
    var buildRegExp = function (expression, flags) {
      return new RegExp(
          (expression + '').replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&'), flags)
    }

    return Object.prototype.toString.call(expression) === '[object RegExp]' ?
      expression : buildRegExp(expression, flags)
  }

  var mapper = function (chunk) {
    return chunk
      .toString()
      .replace(flags ? coerceRegExp(find, flags) : find, replace)
  }

  return map(mapper)
}
