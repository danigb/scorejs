var vows = require('vows');
var assert = require('assert');
var scale = require('../lib/scale.js');

vows.describe('Scale').addBatch({
  "C major": function() {
    var s = scale('C major');
    assert.equal(s.name, 'major');
    assert.deepEqual(s.simple(), "c d e f g a b".split(' '));
  },
  "G major": function() {
    var s = scale('G major');
    assert.equal(s.name, 'major');
    assert.deepEqual(s.simple(), "g a b c d e f#".split(' '));
  }
}).export(module);
