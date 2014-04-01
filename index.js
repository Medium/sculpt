// Copyright 2014. A Medium Corporation

/**
 * @fileoverview Export all of the public modules.
 */
var fs = require('fs')
var path = require('path')

var libPath = path.join(__dirname, 'lib')
fs.readdirSync(libPath).forEach(function (lib) {
  var name = lib.replace('.js', '')
  exports[name] = require(path.join(libPath, name))
})
