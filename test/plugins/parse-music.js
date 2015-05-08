var vows = require('vows');
var assert = require('assert');
var _ = require('lodash');

var score = require('../../lib/score.js')();
score.addPlugin(require('../../lib/plugins/parse-music.js'));

vows.describe('Parse music plugin').addBatch({
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
  "parse rests": function() {
    var s = score('r/4 c2');
    assert.equal(s.events.length, 1);
    assert.equal(s.events[0].str(), 'c2');
    assert.equal(s.events[0].position, 96);
  },
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
}).export(module);
