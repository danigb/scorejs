var vows = require('vows');
var assert = require('assert');
var score = require('../index.js');

vows.describe('Event').addBatch({
  "score is defined": function() {
    assert(score);
    assert(score.Time);
    assert(score.Event);
  },
  "time plugin": function() {
    assert(score.fn.duration);
  },
  "teoria plugin": function() {
    assert(score.fn.transpose);
  },
  "chord player plugin": function() {
    assert(score.fn.playChords);
  }
}).export(module);
