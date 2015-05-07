var vows = require('vows');
var assert = require('assert');

var score = require('../lib/score.js')();

vows.describe('Score').addBatch({
  "constructor" : {
    "by default return score instance": function() {
      assert(score() instanceof score);
    },
    "parse and return a sequence instance": function() {
      assert(score('a') instanceof score.Sequence);
      assert(score(['a']) instanceof score.Sequence);
    },
    "time is 4/4 by default": function() {
      assert(score().time.beats, 4);
      assert(score().time.sub, 4);
    },
    "data object": function() {
      var s = score({title: 'Title'});
      assert.equal(s.data.title, 'Title');
    },
  },
  "parts": {
    "can add a part": function() {
      s = score().part('melody', 'a b c d');
      assert.equal(s.part('melody').events.length, 4);
    },
    "part have score": function() {
      s = score().part('melody', 'a b');
      assert(s.part('melody').score === s, "Score of part");
    },
    "part can have process": function() {
      s = score().part('m', 'a b', function(seq) {
        return seq.map(function(e) { return e.clone({
            value: e.value.toUpperCase()
          });
        });
      });
      assert(s.part('m'));
      assert.equal(s.part('m').toString(), 'A B');
    }
  },
}).export(module);
