vows = require('vows');
assert = require('assert');
_ = require('lodash');

Score = require('../');

vows.describe('Score transform').addBatch({
  "validate an event": function() {
    e = Score.event('a');
    b = Score.event(e);
    assert.deepEqual(e, b);
    assert(e !== b, "Equal but not same");
  },
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
