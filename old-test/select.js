var vows = require('vows')
var assert = require('assert')
var _ = require('lodash')

var Score = require('../')

vows.describe('Select plugin').addBatch({
  'region': function () {
    var s = Score('a | b c | d').region(1, 2)
    assert.deepEqual(_.pluck(s.sequence, 'value'), ['b', 'c'])
    assert.deepEqual(_.pluck(s.sequence, 'position'), [1, 1.5])
  }
}).export(module)
