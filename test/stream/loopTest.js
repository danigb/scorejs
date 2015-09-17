var t = require('../test')
var loop = require('../../lib/stream/loop.js')

t.describe('stream/loop', {
  'loop a value': function () {
    var l = loop('a')
    var result = Array.apply(null, Array(5)).map(function () { return l.next().value })
    t.deepEqual(result, [ 'a', 'a', 'a', 'a', 'a' ])
  },
  'loop an array': function () {
    var l = loop('a b'.split(' '))
    var result = Array.apply(null, Array(5)).map(function () { return l.next().value })
    t.deepEqual(result, [ 'a', 'b', 'a', 'b', 'a' ])
  }
}).export(module)
