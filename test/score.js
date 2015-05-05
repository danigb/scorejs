var vows = require('vows');
var assert = require('assert');

var sequence = require('../lib/sequence.js')();
var score = require('../lib/score.js')(sequence);

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
  },
  "parts": {
    "can add a part": function() {
      s = score().part('melody', 'a b c d');
      assert.equal(s.part('melody').events.length, 4);
    },
  },
}).export(module);
