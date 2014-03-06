# Sculpt

A collection of Node.js [transform stream](http://nodejs.org/api/stream.html#stream_class_stream_transform)
utilities for simple data manipulation.

## API

All of Sculpt's streams operate in `objectMode`, so be careful that you know what data types are
going in and coming out of your streams. Normally Node.js streams are guaranteed to be strings or
buffers, but that is not the case when streams operate in object mode.

**Methods**

*Builders*
* [Map](#map)
* [Filter](#filter)

*Strings*

* [Append](#append)
* [Prepend](#prepend)
* [Replace](#replace)

*Objects*

* [Join](#join)
* [Split](#split)

*Control Flow*

* [Fork](#fork)
* [Tap](#tap)

*Miscellaneous*

* [Pipes](#pipes)

### Map

**Arguments**

* callback: A function to apply to each chunk. The functions result is injected into the stream
in place of the chunk.

```javascript
var stream = sculpt.map(function (chunk) {
  return chunk + chunk
})

stream.pipe(process.stdout)
stream.write('hello')

// hellohello
```

Map can also operate asynchronously. To make the stream async, pass a second argument
(a done callback) and call `.async()`.

```javascript
var stream = sculpt.map(function (chunk, done) {
  requestRemoteData(chunk, function (err, data) {
    done(err, chunk + data)
  })
}).async()

stream.pipe(process.stdout)
stream.write('hello')

// 'hello some remote data...'
```


### Filter

**Arguments**
 * callback: A truth test to apply to each chunk. If the callback returns false, the chunk
 is removed from the stream.

```javascript
var stream = sculpt.filter(function (chunk) {
  return chunk.toString().length >= 5
})

stream.on('data', console.log.bind(console))
stream.write('hi')
stream.write('hello')
stream.write('goodbye')

// 'hellogoodbye'
```

Filter can also operate asynchronously. To make the stream async, pass a second argument
(a done callback) and call `.async()`.

```javascript
var stream = sculpt.filter(function (chunk, done) {
  requestRemoteValidation(chunk, function (err, valid) {
    done(err, !! valid)
  })
}).async()

stream.on('data', console.log.bind(console))
stream.write('hi')
stream.write('hello')
stream.write('goodbye')

// 'hellogoodbye'
```

### Append

**Arguments**

* str: String to append to each chunk.

```javascript
var stream = sculpt.append('!!')

stream.on('data', console.log.bind(console))
stream.write('hello')
stream.write('world')

// 'hello!!world!!'
```

### Prepend

**Arguments**

* str: String to prepend to each chunk.

```javascript
var stream = sculpt.prepend('> ')

stream.pipe(process.stdout)
stream.write('hello\n')
stream.write('world')

// > hello
// > world
```

### Replace

**Arguments**

* find: String or regex to search for in each chunk.
* replace: String or function to replace the found value with.

```javascript
var stream = sculpt.replace('!', '?')

stream.pipe(process.stdout)
stream.write('hello! ')
stream.write('world ')
stream.write('goodbye!')

// 'hello? world goodbye?'
```

### Join

**Arguments**

* str: A string to join each element in the chunk by.

This is intended to be used on arrays, but could work on any data type that has a `join()` method.

```javascript
var stream = sculpt.join('|')

stream.pipe(process.stdout)
stream.write([1, 2, 3])
stream.write(['foo', 'bar'])

// '1|2|3foo|bar'
```

### Split

**Arguments**

* str: A string to split each element in the chunk on.

This is intended to be used on strings (and create arrays), but could work on any data type that
has a `split()` method.

```javascript
var stream = sculpt.split('|')
var partNumber = 0
stream.on('data', function (part) {
  partNumber++
  console.log(partNumber, part)
})

stream.write('hi|bye|foo|bar')

// '1 hi'
// '2 bye'
// '3 foo'
// '4 bar'
```

### Fork

**Arguments**

* stream: A writable stream that will also receive writes passed to this transform stream.

Errors from the forked stream are bubbled up to this transform stream.

```javascript
var stream = sculpt.fork(process.stderr)

stream.pipe(process.stderr)
stream.write('hello world')

// 'hello world' is output to stdout and stderr
```

### Tap

**Arguments**

* callback: A side effect function that is called with each chunk. It's return value is ignored
and the chunk is propagated along the stream, unchanged.

```javascript
var count = 0
var stream = tap(function (item) {
  if (item === 'bump') {
    count++
  }
})

stream.on('end', function () {
  console.log('Count is %d', count)
})

stream.write('bump')
stream.write('bump')
stream.write('hello')
stream.write('bump')

// 'Count is 3'
```

### Pipes

Transform streams can be piped together. Let's say you have a file with song lyrics and you want to clean it up.

```javascript
fs.createReadStream('./lyrics.txt')

  // Split into individual lines
  // The following streams will operate on one line at a time.
  .pipe(sculpt.split('\n'))

  // Remove trailing whitespace from each line
  .pipe(sculpt.replace(/\s+$/, ''))

  // Remove empty lines
  .pipe(sculpt.filter(function (line) {
    return line.length > 0
  }))

  // Bring back line breaks
  .pipe(sculpt.append('\n'))

  // Print the result
  .pipe(process.stdout)
```
