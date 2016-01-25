/* global describe it */
var assert = require('assert')
var _ = require('../lib/index')
var notes = _.notes

assert.events = function (events, arr) {
  assert.deepEqual(Array.from(events), arr)
}

describe('scorejs', function () {
  describe('create events', function () {
    it('create events', function () {
      assert.deepEqual(_.event({val: 2}), { type: 'event', time: 0, val: 2 })
      assert.deepEqual(_.event({val: 2}, { val: 3 }), { type: 'event', time: 0, val: 3 })
    })
    it('create note', function () {
      assert.events(_.note('C2'), [
        { type: 'note', time: 0, val: 'C2', dur: 1 }
      ])
    })
    it('create rests', function () {
      assert.events(_.rest(0.5), [
        { type: 'rest', time: 0, dur: 0.5 }
      ])
    })
  })
  describe('create notes', function () {
    it('create notes', function () {
      assert.events(_.notes('c2 d4'), [
        { type: 'note', time: 0, val: 'C2', dur: 1 },
        { type: 'note', time: 0, val: 'D4', dur: 1 }
      ])
    })
    it('create notes with rests', function () {
      assert.events(_.notes('C2 r D4'), [
        { type: 'note', time: 0, val: 'C2', dur: 1 },
        { type: 'rest', time: 0, dur: 1 },
        { type: 'note', time: 0, val: 'D4', dur: 1 }
      ])
    })
    it('simple usage', function () {
      assert.events(_.notes('c d'), [
        { type: 'note', time: 0, val: 'C', dur: 1 },
        { type: 'note', time: 0, val: 'D', dur: 1 }
      ])
    })
  })
  describe('map sequences', function () {
    it('map events', function () {
      assert.events(_.map(null, null, function (e) {
        return _.event(e, { dur: e.dur * 2 })
      }, _.notes('c d')), [
        { type: 'note', time: 0, val: 'C', dur: 2 },
        { type: 'note', time: 0, val: 'D', dur: 2 }
      ])
    })
    it('map event values', function () {
      assert.events(_.map(null, 'dur', function (d) { return d * 2 }, notes('c d e')), [
        { type: 'note', time: 0, val: 'C', dur: 2 },
        { type: 'note', time: 0, val: 'D', dur: 2 },
        { type: 'note', time: 0, val: 'E', dur: 2 } ])
    })
    it('map to constant', function () {
      assert.events(_.map(null, 'time', 100, notes('c d e')), [
        { type: 'note', time: 100, val: 'C', dur: 1 },
        { type: 'note', time: 100, val: 'D', dur: 1 },
        { type: 'note', time: 100, val: 'E', dur: 1 } ])
    })
    it('currified', function () {
      var time = _.map(null)('time')(20)
      assert.equal(typeof time, 'function')
      assert.events(time(notes('c d e')), [
        { type: 'note', time: 20, val: 'C', dur: 1 },
        { type: 'note', time: 20, val: 'D', dur: 1 },
        { type: 'note', time: 20, val: 'E', dur: 1 } ])
    })
  })
  describe('concat sequences', function () {
    it('concat', function () {
      assert.events(_.concat(_.notes('a b'), _.notes('c d')), [
        { type: 'note', time: 0, val: 'A', dur: 1 },
        { type: 'note', time: 0, val: 'B', dur: 1 },
        { type: 'note', time: 1, val: 'C', dur: 1 },
        { type: 'note', time: 1, val: 'D', dur: 1 }
      ])
    })
  })
  describe('manipulate sequences', function () {
    it('start at', function () {
      assert.events(_.startAt(4, notes('c d e')), [
        { type: 'note', time: 4, val: 'C', dur: 1 },
        { type: 'note', time: 4, val: 'D', dur: 1 },
        { type: 'note', time: 4, val: 'E', dur: 1 } ])
    })
    it('consecutive vents', function () {
      assert.events(_.consecutive(notes('C2 r D2')), [
        { type: 'note', val: 'C2', dur: 1, time: 0 },
        { type: 'rest', dur: 1, time: 1 },
        { type: 'note', val: 'D2', dur: 1, time: 2 } ])
    })
  })
})
