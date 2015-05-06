var vows = require('vows');
var assert = require('assert');
var _ = require('lodash');

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
  },
  "repeat": function() {
    var s = score("a b").repeat(2);
    assert.deepEqual(_.pluck(s.events, 'position'), [0, 192, 384, 576]);
  }
}).export(module);
