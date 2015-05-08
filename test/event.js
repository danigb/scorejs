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
    "all events has position and duration": function() {
      var e = event();
      assert(typeof(e.position) !== 'undefined');
      assert.equal(e.position, 0);
      assert(typeof(e.duration) !== 'undefined');
      assert.equal(e.duration, 0);
    },
    "set properties": function() {
      var a = event({value: 'a', position: 1, duration: 2, type: 'note'});
      assert.equal(a.value, 'a');
      assert.equal(a.position, 1);
      assert.equal(a.duration, 2);
      assert.equal(a.type, 'note');
    }
  },
  "str": function() {
    var o = [];
    o.toString = function() { return 'toString'; }
    var e = event({value: o});
    assert.equal(e.str(), 'toString');
  },
  "set": function() {
    var a = event({value : 'A'});
    var b = a.set('value', 'B');
    assert.equal(a.value, 'A');
    assert.equal(b.value, 'B');
  },
  "clone": {
    "empty obj": function() {
      var a = event({value: 'a', position: 1, duration: 2, type: 'note'});
      var b = a.clone();
      assert.notStrictEqual(a, b);
      assert.equal(b.value, a.value);
      assert.equal(b.position, a.position);
      assert.equal(b.duration, a.duration);
      assert.equal(b.type, a.type);
    },
    "with params": function() {
      var a = event({value: 'a', position: 1, duration: 2, type: 'note'});
      var b = a.clone({ position: a.position + 1 });
      assert.equal(b.value, a.value);
      assert.equal(b.position, a.position + 1);
    }
  }
}).export(module);
