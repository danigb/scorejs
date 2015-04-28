var vows = require('vows');
var assert = require('assert');
var note = require('../lib/note.js');

vows.describe('Note').addBatch({
  "parse note": function() {
    var n = note("c");
    assert.equal(n.name, 'c');
  },
  "parse octaves": function() {
    assert.equal(note('c').oct, 2);
    assert.equal(note('c+').oct, 3);
    assert.equal(note('c++').oct, 4);
    assert.equal(note('c+++').oct, 5);
    assert.equal(note('c-').oct, 1);
    assert.equal(note('c--').oct, 0);
  }
}).export(module);
