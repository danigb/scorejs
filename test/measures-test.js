/* global describe it */

var assert = require('assert')
var score = require('..')

describe('Measures module', function () {
  describe('measure function', function () {
    it('no parenthesis divide time by number of items', function () {
      assert.deepEqual(score.measures('4/4', 'a | b c '), [ 'seq',
      { pitch: 'a', duration: 4 },
      { pitch: 'b', duration: 2 },
      { pitch: 'c', duration: 2 } ])
    })
    it('parenthesis group time', function () {
      assert.deepEqual(score.measures('4/4', '(a b) c'), ['seq',
      { pitch: 'a', duration: 1 },
      { pitch: 'b', duration: 1 },
      { pitch: 'c', duration: 2 } ])
    })
  })
})
