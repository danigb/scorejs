var vows = require('vows');
var assert = require('assert');

var seq = require('../lib/sequence.js')();

vows.describe('Sequence').addBatch({
  "constructor" : {
    "always return score instance": function() {
      assert(seq() instanceof seq);
    },
    "time is 4/4 by default": function() {
      assert(seq().time.beats, 4);
      assert(seq().time.sub, 4);
    },
  },
  "parse no plugins": function() {
    var s = seq('a b');
    assert.equal(s.value(0), 'a');
    assert.equal(s.value(1), 'b');
  },
  "map": {
    "returns a sequence": function() {
      var s = seq('a b').map(function(a) { return a; });
      assert(s instanceof seq);
    },
    "apply the interatee": function() {
      var s = seq('a b').map(function(e) {
        return e.clone({ value: e.value().toUpperCase() })
      });
      assert.equal(s.events[0].value(), 'A');
      assert.equal(s.events[1].value(), 'B');
    }
  },
  "morph": function() {
    var s = seq('a b').morph(function(event, newSeq) {
      newSeq.add(event, {value: event.value().toUpperCase() });
    });
    assert.equal(s.events[0].value(), 'A');
    assert.equal(s.events[1].value(), 'B');
  },
  "toString": function() {
    var s = seq('a b');
    assert.equal(s.toString(), 'a b');
  },
  "clone": function() {
    var s1 = seq('a b c d');
    var s2 = s1.clone();
    for(var i = 0; i < s1.events.length; i++) {
      assert.equal(s2.events[i].value, s1.events[i].value);
    }
  }
}).export(module);
