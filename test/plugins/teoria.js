var vows = require('vows');
var assert = require('assert');
var Score = require('../../lib/score.js');

var score = Score([require('../../lib/plugins/teoria.js')]);

vows.describe('Teoria').addBatch({
  "parse": {
    "parse notes": function() {
      var s = score('a b');
      s.each(function(e) {
        assert.equal(e.type, 'note');
      });
    },
    "parse chords": function() {
      var s = score('C Dm7');
      s.each(function(e) {
        assert.equal(e.type, 'chord');
      });
    },
    "skip unknown": function() {
      var s = score('algo raro');
      assert.equal(s.events[0].value, 'algo');
      assert.equal(s.events[1].value, 'raro');
    }
  },
  "transpose": {
    "transpose a interval": function() {
      var s = score('a2 b2 c3 d3').transpose('M2');
      assert.equal(s.toString(), 'b2 c#3 d3 e3');
    }
  }
}).export(module);
