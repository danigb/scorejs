var vows = require('vows');
var assert = require('assert');
var event = require('../lib/event.js');

vows.describe('Event').addBatch({
  "constructor": {
    "always return an event instance": function() {
      assert(event('a') instanceof event);
    }
  },
  "has properties": function() {
    assert.equal(event('a').value, 'a');
    assert.equal(event('a', 'pos').position, 'pos');
    assert.equal(event('a', null, 'dur' ).duration, 'dur');
  }
}).export(module);
