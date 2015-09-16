var test = require('tape')
var event = require('../lib/event.js')

test('Create an event', function (t) {
  t.deepEqual(event(1, 2, 'value'), [1, 2, 'value'])
  t.deepEqual(event(null, 10, 'value'), [0, 10, 'value'])
  t.deepEqual(event(null, null, 'value'), [0, 0, 'value'])
  t.end()
})

test('Merge an event', function (t) {
  t.deepEqual(event(10, null, null, event(1, 2, 'blah')), [10, 2, 'blah'])
  t.end()
})
