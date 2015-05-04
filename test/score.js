var vows = require('vows');
var assert = require('assert');

var score = require('../lib/score.js')();

vows.describe('Score').addBatch({
  "constructor" : {
    "always return score instance": function() {
      assert(score() instanceof score);
    },
    "time is 4/4 by default": function() {
      assert(score().time.beats, 4);
      assert(score().time.sub, 4);
    },
    "data object": function() {
      var s = score({title: 'Title'});
      assert.equal(s.data.title, 'Title');
    },
    "data can contain source": function() {
      var s = score({source: 'a b c d'});
      assert.equal(s.events.length, 4);
    }
  },
  "parts": {
    "can add a part": function() {
      s = score().part('melody', 'a b c d');
      assert.equal(s.part('melody').events.length, 4);
    },
    "source can be inlined": function() {
      s = score().part('melody', {source: 'a b'});
      assert.equal(s.part('melody').events.length, 2);
    }
  },
  "transactions": {
    "can add events": function() {
      var s = score('a');
      s.each(function(e) {
        this.add(e.clone({position: e.position + 1}));
      });
      assert.equal(s.events.length, 2);
      assert.equal(s.events[1].position, s.events[0].position + 1);
    },
    "can remove events": function() {
      var s = score('a b');
      s.each(function(e) {
        if(e.position == 0) this.remove(e);
      });
      assert.equal(s.events.length, 1);
      assert.equal(s.events[0].value, 'b');
    }
  },
  "parse no plugins": function() {
    var s = score('a b');
    assert.equal(s.events[0].value, 'a');
    assert.equal(s.events[1].value, 'b');
  },
  "toString": function() {
    var s = score('a b');
    assert.equal(s.toString(), 'a b');
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
  "clone": function() {
    var s1 = score('a b c d');
    var s2 = s1.clone();
    for(var i = 0; i < s1.events.length; i++) {
      assert.equal(s2.events[i].value, s1.events[i].value);
    }
  }
}).export(module);
