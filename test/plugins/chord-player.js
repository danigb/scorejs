var vows = require('vows');
var assert = require('assert');
var Score = require('../../lib/score.js');

var teoria = require('teoria');
var teoriaPlugin = require('../../lib/plugins/teoria.js');
var chordPlayerPlugin = require('../../lib/plugins/chord-player.js');
var score = Score([teoriaPlugin, chordPlayerPlugin]);

vows.describe('Chord player').addBatch({
  "playChords method": function() {
    assert(score.fn.playChords);
  },
  "play chords": function() {
    var chord = teoria.chord('Cmaj7');
    var s = score('Cmaj7').playChords();
    assert.equal(s.events.length, chord.notes().length);
    s.events.forEach(function(e) {
      assert.equal(e.type, 'note');
    });
  }
}).export(module);
