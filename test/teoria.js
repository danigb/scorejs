var vows = require('vows');
var assert = require('assert');
var teoria = require('teoria');

vows.describe('teoria').addBatch({
  "middle C": function() {
    var n = teoria.note('b4').midi();
    assert.equal(n, 71);
  }
}).export(module);
