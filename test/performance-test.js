/* global describe it */

var assert = require('assert')
var score = require('..')

describe('Performance module', function () {
  describe('inst function', function () {
    it('can set instrument', function () {
      assert.deepEqual(score.inst('piano', score.phrase('a b c')), [ 'seq',
        { pitch: 'a', duration: 1, inst: 'piano' },
        { pitch: 'b', duration: 1, inst: 'piano' },
        { pitch: 'c', duration: 1, inst: 'piano' } ])
    })
  })

  describe('tempo function', function () {
    it('set tempo and return events', function () {
      assert.deepEqual(score.tempo(120, score.phrase('a b', 1)), [ 'seq',
        { pitch: 'a', duration: 0.5 },
        { pitch: 'b', duration: 0.5 } ])
    })
  })

  describe('vel function', function () {
    it('set velocity and return events', function () {
      assert.deepEqual(score.vel(50, score.phrase('a b', 1)), [ 'seq',
        { pitch: 'a', duration: 1, velocity: 50 },
        { pitch: 'b', duration: 1, velocity: 50 } ])
    })
  })
})
