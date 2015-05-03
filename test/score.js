var vows = require('vows');
var assert = require('assert');

var score = require('../lib/score.js');

vows.describe('Score').addBatch({
  "constructor" : {
    "always return score instance": function() {
      assert(score() instanceof score);
    },
    "time is 4/4 by default": function() {
      assert(score().time.beats, 4);
      assert(score().time.sub, 4);
    }
  },
  "length of score":  {
    "returns the total length": function() {
      var s = score("A | B");
      assert.equal(s.length(), 2 * s.time.measure);
    },
    "no events length": function() {
      assert.equal(score().length(), 0);
    }
  },
  "each": function() {
    var times = 0;
    var s = score('a b c d')
    var s2 = s.each(function(e) {
      times++;
    });
    assert.equal(times, 4);
    assert(s == s2);
  },
  "map": function() {
    var s1 = score('a b c d');
    var s2 = s1.map(function(e) {
      return e.set('value', e.value().toUpperCase());
    });
    assert(s2 instanceof score);
    assert.equal(s2.events.length, 4);
    assert.equal(s2.events[0].value(), 'A')
    assert.equal(s2.events[1].value(), 'B')
    assert.equal(s2.events[2].value(), 'C')
    assert.equal(s2.events[3].value(), 'D')
  },
  "clone": function() {
    var s1 = score('a b c d');
    var s2 = s1.clone();
    for(var i = 0; i < s1.events.length; i++) {
      assert.equal(s2.events[i].value(), s1.events[i].value());
    }
  }
}).export(module);
