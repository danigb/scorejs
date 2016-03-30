/* global describe it */

var assert = require('assert')
var score = require('..')

describe('Timed module', function () {
  describe('forEachTime', function () {
    it('have time', function () {
      var ctx = []
      score.forEachTime(function (time, note, ctx) {
        ctx.push(time)
      }, ctx, score.sim(score.phrase('C D E'), score.phrase('E F G')))

      assert.deepEqual(ctx, [ 0, 1, 2, 0, 1, 2 ])
    })
  })

  describe('events', function () {
    it('have ordered events', function () {
      assert.deepEqual(score.events(score.sim(score.phrase('A B C'), score.phrase('D'))),
      [ [ 0, { pitch: 'A', duration: 1 } ],
      [ 0, { pitch: 'D', duration: 1 } ],
      [ 1, { pitch: 'B', duration: 1 } ],
      [ 2, { pitch: 'C', duration: 1 } ] ])
    })
  })
})
