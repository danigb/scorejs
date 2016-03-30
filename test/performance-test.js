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
})
