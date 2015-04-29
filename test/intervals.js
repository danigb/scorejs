var vows = require('vows');
var assert = require('assert');
var interval = require('../lib/intervals.js');


vows.describe('intervals').addBatch({
  "quality": function() {
    assert.equal(interval('M2').quality, 'M');
    assert.equal(interval('-M2').quality, 'M');
  },
  "direction": function() {
    assert.equal(interval('M2').dir, 1);
    assert.equal(interval('-M2').dir, -1);
  },
  "octaves": function() {
    assert.equal(interval("M3").oct, 0);
    //assert.equal(interval("M11").oct, 1);
  },
  "simple": function() {
    assert.equal(interval("M3").simple, 'M3');
    //assert.equal(interval("-M9").simple, '-M2');
  }
}).export(module);
