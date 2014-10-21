// Copyright 2014. A Medium Corporation

/**
 * @fileoverview A multi-process stream.
 */
var childProcess = require('child_process')
var events = require('events')
var os = require('os')
var Domain = require('domain')
var map = require('./map')

/**
 * Create a cluster stream.
 *
 * @param {string} modulePath
 * @param {number=} nodes
 * @param {Array=} args
 * @param {Object=} env
 * @return {Mapper}
 */
module.exports = function (modulePath, nodes, args, env) {
  var pending = 0
  var emitter = new events.EventEmitter()
  nodes = nodes || os.cpus().length

  var spawnArgs = [modulePath]
  if (args) {
    spawnArgs = spawnArgs.concat(args)
  }

  function getNextWorker(callback) {
    var len = freeWorkerPids.length
    if (len > 0) {
      var freePid = freeWorkerPids.shift()
      callback(null, workers[freePid])
      return
    }

    emitter.once('free', function () {
      getNextWorker(callback)
    })
  }

  function endWorkers() {
    workerPids.forEach(function (pid) {
      workers[pid].kill('SIGKILL')
    })
  }

  var stream = map(function (chunk, callback) {
    pending++
    getNextWorker(function (err, worker) {
      if (err) return callback(err)

      worker.stdin.write(chunk)
      callback()
    })
  }, function (callback) {
    if (pending === 0) {
      endWorkers()
      callback()
      return
    }

    emitter.on('free', function () {
      if (pending > 0) return
      endWorkers()
      callback()
    })
  }).async().ignoreUndefined()

  var workers = {}
  var workerPids = []
  var freeWorkerPids = []

  var domain = Domain.create()
  domain.on('error', function (err) {
    stream.emit('error', err)
  })

  for (var i = 0; i < nodes; i++) {
    var worker = childProcess.spawn('node', spawnArgs, {
      env: env
    })

    worker
      .on('exit', function (code) {
        if (code > 0) {
          stream.emit('error', new Error('Worker ' + worker.pid + ' exited with code ' + code))
        }
      })

    worker.stdout.on('data', function (data) {
      stream.push(data)
      pending--
      freeWorkerPids.push(this.pid)
      emitter.emit('free')
    }.bind(worker))

    workers[worker.pid] = worker
    workerPids.push(worker.pid)
    freeWorkerPids.push(worker.pid)
  }

  return stream
}
