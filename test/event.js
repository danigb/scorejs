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
    assert.equal(event('a').value, 'a');
    assert.equal(event('a', 'pos').position, 'pos');
    assert.equal(event('a', null, 'dur').duration, 'dur');
    assert.equal(event('a', null, 'dur', 't').type, 't');
  },
  "merge": function() {
    var e = event('a', 1, 2, 'empty');
    e.merge({value: 'b', type: 'note', other: 'blah'});
    assert.equal(e.value, 'b');
    assert.equal(e.type, 'note');
    assert.equal(e.other, 'blah');
  },
  "clone": {
    "empty obj": function() {
      var a = event('a', 1, 2, 'note');
      var b = a.clone();
      assert.notStrictEqual(a, b);
      assert.equal(b.value, a.value);
      assert.equal(b.position, a.position);
      assert.equal(b.duration, a.duration);
      assert.equal(b.type, a.type);
    },
    "with params": function() {
      var a = event('a', 1, 2, 'note');
      var b = a.clone({position: a.position + 1});
      assert.equal(b.value, a.value);
      assert.equal(b.position, a.position + 1);
    }
  }
}).export(module);
