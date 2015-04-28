var vows = require('vows');
var assert = require('assert');
var time = require('../lib/time.js');

vows.describe('Time').addBatch({
  "parse time signature": function() {
    var t = time("4/4");
    assert.equal(t.beats, 4);
    assert.equal(t.sub, 4);
  }
}).export(module);
