var vows = require('vows');
var assert = require('assert');
var pitch = require('../lib/pitch.js');

var equal = assert.deepEqual;

vows.describe('pitch').addBatch({
  "parse pitch": {
    "impro-visor notation": function() {
      equal(pitch('c#'), ['c#', 4]);
      equal(pitch('db+'), ['db', 5]);
      equal(pitch('b--'), ['b', 2]);
    },
    "array": function() {
      equal(pitch(['c#', 3]), ['c#', 3]);
    },
    "arguments": function() {
      equal(pitch("gb", 6), ["gb", 6]);
    }
  },
  "midi": {
    "array to midi": function() {
      assert.equal(pitch.midi(['c', 4]), 60);
    }
  },
  "pitch transpose": {
    "octaves": function() {
      equal(pitch.transpose(['c', 4], "P8"), ["c", 5]);
      equal(pitch.transpose(['g', 4], "-P8"), ["g", 5]);
    },
    "M2": function() {
      equal(pitch.transpose('e', "M2"), ['f#', 4]);
      equal(pitch.transpose('b', "M2"), ['c#', 4]);
    }
  },
  "str": function () {
    assert.equal(pitch.str(['g', 3]), 'g-');
    assert.equal(pitch.str(['db', 5]), 'db+');
    assert.equal(pitch.str(['f', 4]), 'f');
  }
}).export(module);
