var vows = require('vows')
var assert = require('assert')
var _ = require('lodash')

var Score = require('../')

vows.describe('Chords plugin').addBatch({
  'chords': function () {
    var s = Score('Cm7').chords();
    assert.deepEqual(s.sequence[0].chord.intervals, [ 'P1', 'm3', 'P5', 'm7' ])
  },
  'playChords': function () {
    var s = Score('Cm7').playChords();
    assert.deepEqual(_.pluck(s.sequence, 'value'), ['c4', 'eb4', 'g4', 'bb4' ])
  }
}).export(module)
