var vows = require('vows');
var assert = require('assert');
var time = require('../lib/time.js');

vows.describe('Time').addBatch({
  "parse time signature": function() {
    var t = time("4/4");
    assert.equal(t.beats, 4);
    assert.equal(t.sub, 4);
  },
  "simple note duration": function() {
    var t = time("4/4");
    assert.equal(t.ticks(1), 384);
    assert.equal(t.ticks(2), 192);
    assert.equal(t.ticks(4), 96);
    assert.equal(t.ticks(8), 48);
    assert.equal(t.ticks(16), 24);
  },
  "has names": function() {
    var t = time('4/4');
    assert.equal(t.measure, 384);
  }
}).export(module);
