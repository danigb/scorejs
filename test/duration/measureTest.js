var test = require('tape')
var measure = require('../../lib/duration/measure')

test('test measure duration', function (t) {
  t.equal(measure('4/4'), 1)
  t.end()
})
