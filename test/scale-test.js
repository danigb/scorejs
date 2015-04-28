var vows = require('vows');
var assert = require('assert');
var scale = require('../lib/scale.js');

vows.describe('Scale').addBatch({
  "C major": function() {
    var s = scale('C major');
    assert.equal(s.name, 'C major');
    assert.equal(s.spell, "c d e f g a b c");
    assert.deepEqual(s.alt, ['C ionian']);
  },
  "C ionian": function() {
    var s = scale('C ionian');
    assert.equal(s.name, 'C ionian');
    assert.equal(s.spell, "c d e f g a b c");
    assert.equal(s.same, 'C major');
  },
  "G mixolydian": function() {
    var s = scale('G mixolydian');
    assert.equal(s.name, 'G mixolydian');
    assert.equal(s.spell, "g a b c d e f g");
  }
}).export(module);
