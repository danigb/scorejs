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
    },
    "set properties": function() {
      var a = event({value: 'a', position: 1, duration: 2, type: 'note'});
      assert.equal(a.value(), 'a');
      assert.equal(a.position(), 1);
      assert.equal(a.duration(), 2);
      assert.equal(a.type(), 'note');
    }
  },
  "str": function() {
    var o = [];
    o.toString = function() { return 'toString'; }
    var e = event({value: o});
    assert.equal(e.str(), 'toString');
  },
  "clone": {
    "empty obj": function() {
      var a = event({value: 'a', position: 1, duration: 2, type: 'note'});
      var b = a.clone();
      assert.notStrictEqual(a, b);
      assert.equal(b.value(), a.value());
      assert.equal(b.position(), a.position());
      assert.equal(b.duration(), a.duration());
      assert.equal(b.type, a.type);
    },
    "with params": function() {
      var a = event({value: 'a', position: 1, duration: 2, type: 'note'});
      var b = a.clone({ position: a.position() + 1 });
      assert.equal(b.value(), a.value());
      assert.equal(b.position(), a.position() + 1);
    }
  }
}).export(module);
