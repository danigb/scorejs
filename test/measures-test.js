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
    it('can have nested parenthesis', function () {
      assert.deepEqual(score.measures('4/4', 'a (b (c d))'), [ 'seq',
        { pitch: 'a', duration: 2 },
        { pitch: 'b', duration: 1 },
        { pitch: 'c', duration: 0.5 },
        { pitch: 'd', duration: 0.5 } ])
    })
    it('can handle 3/4 meter', function () {
      assert.deepEqual(score.measures('3/4', 'a b c'),
        score.phrase('a b c', 1))
    })
    it('can handle 6/8 meter', function () {
      assert.deepEqual(score.measures('6/8', 'a b'),
        score.phrase('a b', 1.5))
    })
  })
})