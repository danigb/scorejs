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
  "set": {
    "set properties": function() {
      s = Score('a b').set({instrument: 'piano'});
      assert.deepEqual(_.pluck(s.sequence, 'instrument'), ['piano', 'piano']);
    },
    "set duration doesn't change position": function() {
      s = Score('a b', { set: { duration: 2, instrument: 'organ'}});
      assert.deepEqual(_.pluck(s.sequence, 'duration'), [2, 2]);
      assert.deepEqual(_.pluck(s.sequence, 'position'), [0, 0.25]);
      assert.deepEqual(_.pluck(s.sequence, 'instrument'), ['organ', 'organ']);
    }
  },
  "combine": {
    "merge": function() {
      s = Score.merge(Score('a b'), Score('c d'));
      assert.deepEqual(_.pluck(s.sequence, 'value'), ['a', 'c', 'b', 'd']);
      assert.deepEqual(_.pluck(s.sequence, 'duration'), [1/4, 1/4, 1/4, 1/4]);
      assert.deepEqual(_.pluck(s.sequence, 'position'), [0, 0, 0.25, 0.25]);
    },
    "concat": function() {
      s = Score.concat(Score('a b'), Score('c d'));
      assert.deepEqual(_.pluck(s.sequence, 'value'), ['a', 'b', 'c', 'd']);
      assert.deepEqual(_.pluck(s.sequence, 'duration'), [1/4, 1/4, 1/4, 1/4]);
      assert.deepEqual(_.pluck(s.sequence, 'position'), [0, 0.25, 0.5, 0.75]);
    }
  }
}).export(module);
