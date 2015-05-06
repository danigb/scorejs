var vows = require('vows');
var assert = require('assert');
var _ = require('lodash');

var score = require('../../lib/score.js');
score.plugins(require('../../lib/plugins/functional.js'));

vows.describe('Functional plugin').addBatch({
  "merge": function() {
    s = score('a b').merge(score('c d'));
    assert.equal(s.events.length, 4);
    values = _.pluck(s.events, 'value');
    assert.deepEqual(values, ['a', 'c', 'b', 'd']);
    positions = _.pluck(s.events, 'position');
    assert.deepEqual(positions, ['0', '0', '96', '96']);
  }
}).export(module);
