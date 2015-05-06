var vows = require('vows');
var assert = require('assert');

var score = require('../../lib/score.js');

score.plugins(require('../../lib/plugins/teoria.js'));

vows.describe('Teoria').addBatch({
  "parse notes": {
    "type is note": function(){
      var s = score('a b');
      s.events.forEach(function(e) {
        assert.equal(e.type, 'note');
      });
    },
    "teoria note": function() {
      var s = score('c2');
      assert.equal(s.events[0].value.name(), 'c');
      assert.equal(s.events[0].value.octave(), 2);
    }
  },
  "parse": {
    "parse chords": function() {
      var s = score('C Dm7');
      s.events.forEach(function(e) {
        assert.equal(e.type, 'chord');
      });
    },
    "skip unknown": function() {
      var s = score('algo raro');
      assert.equal(s.events[0].value, 'algo');
      assert.equal(s.events[1].value, 'raro');
    }
  },
  "teoria:transpose": {
    "transpose a interval": function() {
      var s = score('a2 b2 c3 d3').transpose('M2');
      assert.equal(s.toString(), 'b2 c#3 d3 e3');
    }
  }
}).export(module);
