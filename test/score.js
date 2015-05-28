vows = require('vows');
assert = require('assert');
_ = require('lodash');

Score = require('../');

vows.describe('Score').addBatch({
  "parse": {
    "parse melody": function() {
      s = Score('a b');
      assert.deepEqual(_.pluck(s.sequence, 'value'), [ 'a', 'b' ]);
      assert.deepEqual(_.pluck(s.sequence, 'position'), [ 0, 0.25 ]);
      assert.deepEqual(_.pluck(s.sequence, 'duration'), [0.25, 0.25]);
    },
    "parse measure": function() {
      s = Score('a b |');
      assert.deepEqual(_.pluck(s.sequence, 'value'), [ 'a', 'b' ]);
      assert.deepEqual(_.pluck(s.sequence, 'position'), [0, 0.5]);
      assert.deepEqual(_.pluck(s.sequence, 'duration'), [0.5, 0.5]);
    },
    "custom time signature": function() {
      s = Score("a b c |", "3/4");
      assert.equal(s.time, '3/4');
      assert.deepEqual(_.pluck(s.sequence, 'value'), [ 'a', 'b', 'c' ]);
      assert.deepEqual(_.pluck(s.sequence, 'position'), [0, 0.25, 0.5]);
      assert.deepEqual(_.pluck(s.sequence, 'duration'), [0.25, 0.25, 0.25]);
    }
  },
  "utility": {
    "clone score": function() {
      s1 = Score('a b');
      s2 = s1.clone();
      assert.deepEqual(s1.sequence, s2.sequence);
      assert(s1 !== s2, "are equal but not same");
    },
    "duration": function() {
      s = Score('a b c d e f');
      assert.equal(s.duration(), 1.5);
    }
  }
}).export(module);
