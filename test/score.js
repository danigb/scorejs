var vows = require('vows');
var assert = require('assert');

var score = require('../lib/score.js');

vows.describe('Score').addBatch({
  "constructor" : {
    "always return score instance": function() {
      assert(score() instanceof score);
    },
    "time is 4/4 by default": function() {
      assert(score().time.beats, 4);
      assert(score().time.sub, 4);
    }
  },
  "length":  {
    "returns the total length": function() {
      var s = score("A | B");
      assert.equal(s.length(), 2 * s.time.measure);
    },
    "no events length": function() {
      assert.equal(score().length(), 0);
    }
  }

}).export(module);
