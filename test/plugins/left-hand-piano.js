var vows = require('vows');
var assert = require('assert');
var teoria = require('teoria');

var score = require('../../index.js');

vows.describe('Chord player').addBatch({
  "leftHandPiano method": function() {
    assert(score.fn.leftHandPiano);
  },
  "play chords": function() {
    var chord = teoria.chord('Cmaj7');
    var s = score('Cmaj7').leftHandPiano({instrument: 'myInstrument'});
    assert.equal(s.events.length, chord.notes().length);
    s.events.forEach(function(e) {
      assert.equal(e.type, 'note');
      assert.equal(e.instrument, 'myInstrument');
      assert.equal(e.fromChord, 'Cmaj7');
    });
  }
}).export(module);
