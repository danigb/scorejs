var vows = require('vows')
var assert = require('assert')
var _ = require('lodash')

var Score = require('../')

vows.describe('Musical plugin').addBatch({
  'transpose notes': function () {
    var s = Score('a2 b2 c3 d3').transpose('M2')
    assert.deepEqual(_.pluck(s.sequence, 'value'), [ 'b2', 'c#3', 'd3', 'e3' ])
  },
  'transpose with rests': function () {
    var s = Score('a r b').transpose('M2')
    assert.deepEqual(_.pluck(s.sequence, 'value'), [ 'b4', 'r', 'c#5' ])
  },
  'select notes': function() {
    var s = Score('a b r c').notes()
    assert.deepEqual(_.pluck(s.sequence, 'value'), [ 'a', 'b', 'c' ])
  }

}).export(module)
