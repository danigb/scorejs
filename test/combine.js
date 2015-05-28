vows = require('vows');
assert = require('assert');
_ = require('lodash');

Score = require('../');

vows.describe('Score merge/concat').addBatch({
  "merge": function() {
    s = Score.merge(Score('a b'), Score('c d'));
    assert.deepEqual(_.pluck(s.sequence, 'value'), ['a', 'c', 'b', 'd']);
    assert.deepEqual(_.pluck(s.sequence, 'duration'), [1/4, 1/4, 1/4, 1/4]);
    assert.deepEqual(_.pluck(s.sequence, 'position'), [0, 0, 0.25, 0.25]);
  },
  "static concat": function() {
    s = Score.concat(Score('a b'), Score('c d'));
    assert.deepEqual(_.pluck(s.sequence, 'value'), ['a', 'b', 'c', 'd']);
    assert.deepEqual(_.pluck(s.sequence, 'duration'), [1/4, 1/4, 1/4, 1/4]);
    assert.deepEqual(_.pluck(s.sequence, 'position'), [0, 0.25, 0.5, 0.75]);
  }
}).export(module);
