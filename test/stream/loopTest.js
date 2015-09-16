var test = require('tape')
var loop = require('../../lib/stream/loop.js')

test('loop a value', function (t) {
  var l = loop('a')
  var result = Array.apply(null, Array(5)).map(function () { return l.next().value })
  t.deepEqual(result, [ 'a', 'a', 'a', 'a', 'a' ])
  t.end()
})

test('loop an array', function (t) {
  var l = loop('a b'.split(' '))
  var result = Array.apply(null, Array(5)).map(function () { return l.next().value })
  t.deepEqual(result, [ 'a', 'b', 'a', 'b', 'a' ])
  t.end()
})
