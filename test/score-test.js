/* global describe it */

var assert = require('assert')
var _ = require('..')

describe('Score module', function () {
  describe('el function', function () {
    it('accepts duration', function () {
      assert.deepEqual(_.el(2), { duration: 2 })
    })
    it('accepts duration and data', function () {
      assert.deepEqual(_.el(3, { any: 'thing' }), { duration: 3, any: 'thing' })
    })
    it('accepts two object to merge as they were immutable', function () {
      var note = _.el(3, { pitch: 'A' })
      var update = { pitch: 'C' }
      assert.deepEqual(_.el(note, update), { duration: 3, pitch: 'C' })
      assert.deepEqual(note, { duration: 3, pitch: 'A' })
      assert.deepEqual(update, { pitch: 'C' })
    })
  })
  describe('note function', function () {
    it('duration is 1 by default', function () {
      assert.deepEqual(_.note('A'), { pitch: 'A', duration: 1 })
    })
    it('accepts pitch and duration', function () {
      assert.deepEqual(_.note('A', 2), { pitch: 'A', duration: 2 })
    })
    it('accepts pitch, duration and data', function () {
      assert.deepEqual(_.note('A', 3, { inst: 'synth' }),
      { pitch: 'A', duration: 3, inst: 'synth' })
    })
  })

  describe('sequential', function () {
    it('from array', function () {
      assert.deepEqual(_.seq([_.note('A'), _.note('B')]), ['seq',
      { pitch: 'A', duration: 1 },
      { pitch: 'B', duration: 1 } ])
    })
    it('from arguments', function () {
      assert.deepEqual(_.seq(_.note('A'), _.note('B')),
        _.seq([_.note('A'), _.note('B')]))
    })
    it('joins seq sim', function () {
      assert.deepEqual(_.seq(_.sim(_.note('A'))),
        [ 'seq', [ 'sim', { pitch: 'A', duration: 1 } ] ])
    })
  })
  describe('simultaneous', function () {
    it('from array', function () {
      assert.deepEqual(_.sim([_.note('A'), _.note('B')]), ['sim',
      { pitch: 'A', duration: 1 },
      { pitch: 'B', duration: 1 } ])
    })
    it('from arguments', function () {
      assert.deepEqual(_.sim(_.note('A'), _.note('B')),
        _.sim([_.note('A'), _.note('B')]))
    })
    it('joins sim seq', function () {
      assert.deepEqual(_.sim(_.seq(_.note('A'))),
        ['sim', ['seq', { duration: 1, pitch: 'A' }]])
    })
  })

  describe('transform function', function () {
    var T = _.transform(
      function (note) { return note.pitch },
      function (seq) { return '(' + seq.join(',') + ')' },
      function (par) { return '[' + par.join('+') + ']' }
    )
    it('can transform notes', function () {
      assert.deepEqual(T(_.note('A')), 'A')
    })
    it('can transform sequences', function () {
      assert.deepEqual(T(_.phrase('A B C')), '(A,B,C)')
    })
    it('can transform sim', function () {
      assert.deepEqual(T(_.chord('A B C')), '[A+B+C]')
    })
    it('can transform musical structures', function () {
      assert.deepEqual(T(_.sim(
        _.phrase('A B C'), _.seq(_.chord('C E G'), _.chord('D F A'))
      )), '[(A,B,C)+([C+E+G],[D+F+A])]')
    })
  })

  describe('map function', function () {
    it('can map notes', function () {
      var transform = _.map(function (note) {
        return Object.assign({}, note, { inst: 'piano' })
      })
      assert.deepEqual(transform(_.seq(_.chord('A B'), _.chord('B C'))), ['seq',
        ['sim', { pitch: 'A', duration: 1, inst: 'piano' },
        { pitch: 'B', duration: 1, inst: 'piano' }],
        ['sim', { pitch: 'B', duration: 1, inst: 'piano' },
        { pitch: 'C', duration: 1, inst: 'piano' }] ])
    })
  })
})
