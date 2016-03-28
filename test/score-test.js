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
    it('create sequential structure', function () {
      assert.deepEqual(_.sequential([_.note('A'), _.note('B')]), ['seq',
      { pitch: 'A', duration: 1 },
      { pitch: 'B', duration: 1 } ])
    })
    it('from arguments', function () {
      assert.deepEqual(_.seq(_.note('A'), _.note('B')),
        _.sequential([_.note('A'), _.note('B')]))
    })
  })
  describe('parallel', function () {
    it('create parallel structure', function () {
      assert.deepEqual(_.parallel([_.note('A'), _.note('B')]), ['par',
      { pitch: 'A', duration: 1 },
      { pitch: 'B', duration: 1 } ])
    })
    it('from arguments', function () {
      assert.deepEqual(_.par(_.note('A'), _.note('B')),
        _.parallel([_.note('A'), _.note('B')]))
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
    it('can transform parallel', function () {
      assert.deepEqual(T(_.chord('A B C')), '[A+B+C]')
    })
    it('can transform musical structures', function () {
      assert.deepEqual(T(_.par(
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
        ['par', { pitch: 'A', duration: 1, inst: 'piano' },
        { pitch: 'B', duration: 1, inst: 'piano' }],
        ['par', { pitch: 'B', duration: 1, inst: 'piano' },
        { pitch: 'C', duration: 1, inst: 'piano' }] ])
    })
  })
})
