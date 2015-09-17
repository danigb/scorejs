var t = require('../test')
var event = require('../../lib/sequence/event')

t.describe('event', {
  'Create an event': function () {
    t.deepEqual(event(['value']),
      { value: 'value', position: 0, duration: 0 })
    t.deepEqual(event(['value', 1]),
      { value: 'value', position: 0, duration: 1 })
    t.deepEqual(event(['value', 1, 2]),
      { value: 'value', position: 2, duration: 1 })
    t.deepEqual(event(['value', 1, 2, 3]),
      { value: 'value', position: 2, duration: 1 })
  },
  'Merge an event': function () {
    t.deepEqual(event(['a', 1, -1], ['b']),
      { value: 'b', position: -1, duration: 1 })
  }
}).export(module)
