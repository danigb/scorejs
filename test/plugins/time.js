var vows = require('vows');
var assert = require('assert');

var score = require('../../lib/score.js');
score.plugins(require('../../lib/plugins/time.js'));

vows.describe('Time plugin').addBatch({
  "duration":  {
    "returns the total length": function() {
      var s = score("A | B");
      assert.equal(s.duration(), 2 * s.time.measure);
    },
    "no events length": function() {
      assert.equal(score("").duration(), 0);
    }
  }
}).export(module);
