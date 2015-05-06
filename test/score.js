var vows = require('vows');
var assert = require('assert');

var sequence = require('../lib/sequence.js')();
var score = require('../lib/score.js');

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
    "part can have process": function() {
      s = score().part('m', 'a b', function(seq) {
        return seq.transpose('M2');
      });
      events = s.part('m').events;
      assert.equal(s.part('m').toString(), 'b3 c#4');
    }
  },
}).export(module);
