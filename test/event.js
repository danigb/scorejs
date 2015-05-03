var vows = require('vows');
var assert = require('assert');
var event = require('../lib/event.js');

vows.describe('Event').addBatch({
  "constructor": {
    "always return an event instance": function() {
      assert(event('a') instanceof event);
    },
    "return same instance": function() {
      var a = event('a');
      assert(a === event(a));
    }
  },
  "has properties": function() {
    assert.equal(event('a').value(), 'a');
    assert.equal(event('a', 'pos').position(), 'pos');
    assert.equal(event('a', null, 'dur').duration(), 'dur');
    assert.equal(event('a', null, 'dur', 't').type(), 't');
  },
  "clone": function() {
    var a = event('a');
    var b = a.clone(a);
    assert.notStrictEqual(a, b);
    assert.equal(b.value(), a.value());
  },
  "set": function() {
    var a = event('a');
    var b = a.set('note', 'c');
    assert.equal(b.get('note'), 'c');
    assert.equal(b.value(), 'a');
  },
  "merge": function() {
    var a = event('a');
    var b = a.merge({ note: 'd#' });
    assert.equal(b.value(), 'a');
    assert.equal(b.get('note'), 'd#');
    var c = b.merge({'chord': 'Cmaj'});
    assert.equal(c.get('note'), 'd#');
    assert.equal(c.get('chord'), 'Cmaj');
  }
}).export(module);
