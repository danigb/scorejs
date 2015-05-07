var vows = require('vows');
var assert = require('assert');
var _ = require('lodash');

var score = require('../../lib/score.js')();
score.addPlugin(require('../../lib/plugins/time.js'));

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
    var positions = _.pluck(s.events, 'position');
    assert.deepEqual(positions, [0, 96, 192, 288]);
  },
  "delay": function() {
    var s = score('a').delay(100, { repeat: 4});
    assert.equal(s.events.length, 5);
    var positions = _.pluck(s.events, 'position');
    assert.deepEqual(positions, [0, 100, 200, 300, 400]);
  }
}).export(module);
