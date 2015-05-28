vows = require('vows');
assert = require('assert');
_ = require('lodash');

Score = require('../');

vows.describe('Score.event').addBatch({
  "clone event": function() {
    e = Score.event('a');
    b = Score.event(e);
    assert.deepEqual(e, b);
    assert(e !== b, "Equal but not same");
  },
  "clone event and merge": function() {
    a = Score.event('a', { type: 'note' });
    assert.deepEqual(a, {value: 'a', position: 0, duration: 0, type: 'note'});
    b = Score.event(a, { pitch: 56 });
    assert.deepEqual(b, {value: 'a', position: 0, duration: 0, type: 'note', pitch: 56});
  },
  "create event and merge": function() {
    assert.deepEqual(Score.event('a'), {
      value: 'a',
      position: 0,
      duration: 0 });
  },
}).export(module);
