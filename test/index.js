var vows = require('vows');
var assert = require('assert');
var score = require('../index.js');

vows.describe('Event').addBatch({
  "score is defined": function() {
    assert(score != undefined);
    assert(score.Time != undefined);
    assert(score.Event != undefined);
  }
}).export(module);
