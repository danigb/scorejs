var vows = require('vows');
var assert = require('assert');
var score = require('../index.js');

vows.describe('Event').addBatch({
  "score is defined": function() {
    assert(score);
  },
  "sequence is defined": function() {
    assert(score.Sequence);
    assert(score.Sequence.Time);
    assert(score.Sequence.Event);
  },
  "time plugin": function() {
    assert(score.fn.duration);
  },
  "teoria plugin": function() {
    assert(score.fn.transpose);
  },
  "left hand piano plugin": function() {
    assert(score.fn.leftHandPiano);
  },
  "walking bass plugin": function() {
    assert(score.fn.walkingBass);
  }
}).export(module);
