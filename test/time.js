var vows = require('vows')
var assert = require('assert')
var _ = require('lodash')

var Score = require('../')

vows.describe('Time plugin').addBatch({
  'duration': function () {
    var s = Score('a b c d e f')
    assert.equal(s.duration(), 1.5)
  },
  'delay method': function () {
    var s = Score('a b').delay(100)
    assert.deepEqual(_.pluck(s.sequence, 'position'), [100, 100.25])
  },
  'repeat method': function () {
    var s = Score('a b').repeat(3)
    assert.deepEqual(_.pluck(s.sequence, 'value'), ['a', 'b', 'a', 'b', 'a', 'b'])
    assert.deepEqual(_.pluck(s.sequence, 'position'), [0, 0.25, 0.5, 0.75, 1, 1.25])
    assert.deepEqual(_.pluck(s.sequence, 'duration'), [0.25, 0.25, 0.25, 0.25, 0.25, 0.25])
  },
  'reverse': function () {
    var s = Score('a/8 b/4 c/2').reverse()
    assert.deepEqual(_.pluck(s.sequence, 'value'), ['c', 'b', 'a'])
    assert.deepEqual(_.pluck(s.sequence, 'duration'), [0.5, 0.25, 0.125])
    assert.deepEqual(_.pluck(s.sequence, 'position'), [0, 0.5, 0.75])
  },
  'compact': function () {
    var s = Score('a b c/8', function (event) {
      return event.value === 'b' ? null : event
    }).compact()
    assert.deepEqual(_.pluck(s.sequence, 'value'), ['a', 'c'])
    assert.deepEqual(_.pluck(s.sequence, 'duration'), [0.25, 0.125])
    assert.deepEqual(_.pluck(s.sequence, 'position'), [0, 0.25])
  },
  'toTempo': {
    '4/4 tempo': function () {
      var s = Score('a / b c |')
      var bpm60 = s.toTempo(60)
      assert.deepEqual(_.pluck(bpm60.sequence, 'duration'), [0.5, 0.25, 0.25])
      assert.deepEqual(_.pluck(bpm60.sequence, 'position'), [0, 0.5, 0.75])
      var bpm120 = s.toTempo(120)
      assert.deepEqual(_.pluck(bpm120.sequence, 'duration'), [ 0.25, 0.125, 0.125 ])
      assert.deepEqual(_.pluck(bpm120.sequence, 'position'), [ 0, 0.25, 0.375 ])
    }
  }
}).export(module)
