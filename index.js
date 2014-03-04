// Copyright 2014. A Medium Corporation

/**
 * @file Export all of the public modules.
 */
var fs = require('fs')
var path = require('path')

var libPath = path.join(__dirname, 'lib')
fs.readdirSync(libPath).forEach(function (lib) {
  if (lib.slice(0, 1) === '_') return

  var name = lib.replace('.js', '')
  exports[name] = require(path.join(libPath, name))
})
