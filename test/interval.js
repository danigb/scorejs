var vows = require('vows');
var assert = require('assert');
var interval = require('../lib/interval.js');

vows.describe('interval').addBatch({
  "transpose": {
    "transpose M2": function() {
      var n = interval.transpose('c', 'M2');
      assert.equal(n, 'd');
    }
  }
}).export(module);
