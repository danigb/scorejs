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
  "combine plugin": function() {
    assert(Score.fn.merge);
  },
  "teoria plugin": function() {
    assert(Score.Teoria, "teoria is defined");
  },
  "pitch plugin": function() {
    assert(Score.fn.transpose);
  },
  "chords plugin": function() {
    assert(Score.fn.roots);
  }
}).export(module);
