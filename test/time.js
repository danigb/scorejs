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
    assert.equal(t(1), 384);
    assert.equal(t(2), 192);
    assert.equal(t(4), 96);
    assert.equal(t(8), 48);
    assert.equal(t(16), 24);
  }
}).export(module);
