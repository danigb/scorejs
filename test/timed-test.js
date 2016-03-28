/* global describe it */

var assert = require('assert')
var _ = require('..')

describe('Timed module', function () {
  describe('forEachTime', function () {
    it('have time', function () {
      var ctx = []
      _.forEachTime(function (time, note, ctx) {
        ctx.push(time)
      }, _.par(_.phrase('C D E'), _.phrase('E F G')), ctx)

      assert.deepEqual(ctx, [ 0, 1, 2, 0, 1, 2 ])
    })
  })

  describe('events', function () {
    it('have ordered events', function () {
      assert.deepEqual(_.events(_.par(_.phrase('A B C'), _.phrase('D'))),
      [ [ 0, { pitch: 'A', duration: 1 } ],
      [ 0, { pitch: 'D', duration: 1 } ],
      [ 1, { pitch: 'B', duration: 1 } ],
      [ 2, { pitch: 'C', duration: 1 } ] ])
    })
  })
})
