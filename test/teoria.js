var vows = require('vows');
var assert = require('assert');
var score = require('../lib/score.js');

score.plugin(require('../lib/teoria.js'));

vows.describe('Teoria').addBatch({
  "parse notes": function() {
    var s = score('a b');
    s.each(function(e) {
      assert.equal(e.type, 'note');
      assert(e.value instanceof score.Note);
    });
  },
  "parse chords": function() {
    var s = score('C Dm7');
    s.each(function(e) {
      assert.equal(e.type, 'chord');
      assert(e.value instanceof score.Chord);
    });
  },
  "skip unknown": function() {
    var s = score('algo raro');
    assert.equal(s.events[0].value, 'algo');
    assert.equal(s.events[1].value, 'raro');
  }
}).export(module);
