var vows = require('vows');
var assert = require('assert');
var Score = require('../index.js');

vows.describe('Event').addBatch({
  "Score is defined": function() {
    assert(Score, "Score should be defined");
    assert(Score.Sequence, "Score.Sequence is defined");
  },
  "sequence is defined": function() {
    assert(Score.Sequence);
    assert(Score.Sequence.Time);
    assert(Score.Sequence.Event);
  },
  "time plugin": function() {
    assert(Score.fn.duration);
  },
  "teoria plugin": function() {
    assert(Score.Teoria, "teoria is defined");
    assert(Score.fn.transpose, "transpose method");
  },
  "left hand piano plugin": function() {
    assert(Score.fn.leftHandPiano);
  },
  "walking bass plugin": function() {
    assert(Score.fn.walkingBass);
  }
}).export(module);
