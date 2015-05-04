var vows = require('vows');
var assert = require('assert');
var Score = require('../../lib/score.js');

var score = Score([require('../../lib/plugins/time.js')]);

vows.describe('Time plugin').addBatch({
  "duration":  {
    "returns the total length": function() {
      var s = score("A | B");
      assert.equal(s.duration(), 2 * s.time.measure);
    },
    "no events length": function() {
      assert.equal(score().duration(), 0);
    }
  }
}).export(module);
