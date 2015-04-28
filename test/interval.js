var vows = require('vows');
var assert = require('assert');
var $ = require('../lib/interval.js');

vows.describe('interval').addBatch({
  "quality": function() {
    assert.equal($('M2').quality, 'M');
    assert.equal($('-M2').quality, 'M');
  },
  "direction": function() {
    assert.equal($('M2').direction, 1);
    assert.equal($('-M2').direction, -1);
  },
  "octaves": function() {
    assert.equal($("M3").octaves, 0);
    assert.equal($("M11").octaves, 1);
  },
  "simple": function() {
    assert.equal($("M3").simple, 'M3');
    assert.equal($("-M9").simple, '-M2');
  }
}).export(module);
