var vows = require('vows');
var assert = require('assert');
var teoria = require('teoria');

var score = require('../../index.js');

vows.describe('Chord player').addBatch({
  "playChords method": function() {
    assert(score.fn.playChords);
  },
  "play chords": function() {
    var chord = teoria.chord('Cmaj7');
    var s = score('Cmaj7').playChords({instrument: 'myInstrument'});
    assert.equal(s.events.length, chord.notes().length);
    s.events.forEach(function(e) {
      assert.equal(e.type, 'note');
      assert.equal(e.get('instrument'), 'myInstrument');
      assert.equal(e.get('fromChord'), 'Cmaj7');
    });
  }
}).export(module);
