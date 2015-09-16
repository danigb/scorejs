var test = require('tape')
var sequence = require('../lib/sequence.js')

test('Create a sequence', function (t) {
  t.deepEqual(sequence('a b c'), [ [ 0, 384, 'a' ], [ 384, 384, 'b' ], [ 768, 384, 'c' ] ])
  t.end()
})
