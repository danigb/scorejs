/* global describe it */
var assert = require('assert')
var $ = require('../lib/generators')
var arr = Array.from

describe('scorejs', function () {
  it('create events', function () {
    assert.deepEqual($.event({val: 2}), { type: 'event', time: 0, val: 2 })
    assert.deepEqual($.event({val: 2}, { val: 3 }), { type: 'event', time: 0, val: 3 })
  })
  it('create note', function () {
    assert.deepEqual(arr($.note('C2')),
      [{ type: 'note', time: 0, val: 'C2', dur: 1 }])
  })
  it('create notes', function () {
    assert.deepEqual(arr($.notes('C2 D4')),
      [{ type: 'note', time: 0, val: 'C2', dur: 1 },
      { type: 'note', time: 0, val: 'D4', dur: 1 }])
  })
  it('create rests', function () {
    assert.deepEqual(arr($.rest(0.5)),
      [ { type: 'rest', time: 0, dur: 0.5 } ])
  })
  it('create sequence', function () {
    assert.deepEqual(arr($.sequence([$.note('C2'), $.rest(), $.note('D2')])),
      [ { type: 'note', val: 'C2', dur: 1, time: 0 },
      { type: 'rest', dur: 1, time: 1 },
      { type: 'note', val: 'D2', dur: 1, time: 2 } ])
  })
})
