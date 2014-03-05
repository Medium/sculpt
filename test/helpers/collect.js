// Copyright 2014. A Medium Corporation

/**
* @file A simple writeable stream that collects objects from
* a readable stream.
*/
var sculpt = require('../../index')

/**
 * A simple transform stream that just collects incoming objects.
 * @return {stream.Transform}
 */
module.exports = function () {
	var objects = []
	var collector = sculpt.tap(objects.push.bind(objects))

	collector.getObjects = function () {
		return objects
	}

	return collector
}
