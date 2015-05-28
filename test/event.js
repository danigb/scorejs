vows = require('vows');
assert = require('assert');
_ = require('lodash');

Score = require('../');

vows.describe('Score transform').addBatch({
  "create event": function() {
    assert.deepEqual(Score.event('a'), {
      value: 'a',
      position: 0,
      duration: 0 });
  },
  "merge event properties": function() {
    assert.deepEqual(Score.event('a', { duration: 'q', position: 1}, { type: 'note'}), {
      value: 'a',
      position: 1,
      duration: 'q',
      type: 'note'});
  }
}).export(module);
