var vows = require('vows');
var assert = require('assert');

var seq = require('../lib/sequence.js')();

vows.describe('Sequence').addBatch({
  "sequence:constructor" : {
    "always return score instance": function() {
      assert(seq() instanceof seq);
    },
    "time is 4/4 by default": function() {
      assert(seq().time.beats, 4);
      assert(seq().time.sub, 4);
    },
  },
  "sequence:parse": function() {
    var s = seq('a b');
    assert.equal(s.events[0].value, 'a');
    assert.equal(s.events[1].value, 'b');
  },
  "sequence:map": {
    "returns a sequence": function() {
      var s = seq('a b').map(function(a) { return a; });
      assert(s instanceof seq);
    },
    "clone a seq no iterator": function() {
      var s = seq('a b').map();
      assert.equal(s.events.length, 2);
      assert.equal(s.events[0].value, 'a');
      assert.equal(s.events[1].value, 'b');
    },
    "apply the interatee": function() {
      var s = seq('a b').map(function(e) {
        return e.clone({ value: e.value.toUpperCase() })
      });
      assert.equal(s.events[0].value, 'A');
      assert.equal(s.events[1].value, 'B');
    },
    "compact the result": function() {
      var s = seq('a b c').map(function(e) {
        if(e.value == 'b') return e;
      });
      assert.equal(s.events.length, 1);
      assert.equal(s.events[0].value, 'b');
    },
    "flatten the result": function() {
      var s = seq('a').map(function(e) {
        return [e, e];
      });
      assert.equal(s.events.length, 2);
      assert.equal(s.events[0], s.events[1]);
    }
  },
  "sequence:toString": function() {
    var s = seq('a b');
    assert.equal(s.toString(), 'a b');
  }
}).export(module);
