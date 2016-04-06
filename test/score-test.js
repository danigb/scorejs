/* global describe it */

var assert = require('assert')
var score = require('..')

describe('Score module', function () {
  describe('el function', function () {
    it('accepts duration', function () {
      assert.deepEqual(score.el(2), { duration: 2 })
    })
    it('accepts duration and data', function () {
      assert.deepEqual(score.el(3, { any: 'thing' }),
        { duration: 3, any: 'thing' })
    })
    it('accepts two object to merge as they were immutable', function () {
      var note = score.el(3, { pitch: 'A' })
      var update = { pitch: 'C' }
      assert.deepEqual(score.el(note, update), { duration: 3, pitch: 'C' })
      assert.deepEqual(note, { duration: 3, pitch: 'A' })
      assert.deepEqual(update, { pitch: 'C' })
    })
  })
  describe('note function', function () {
    it('partially apply duration', function () {
      var qn = score.note(1)
      assert.deepEqual(qn('A'), { pitch: 'A', duration: 1 })
    })
    it('accepts pitch and duration', function () {
      assert.deepEqual(score.note(2, 'A'), { pitch: 'A', duration: 2 })
    })
    it('accepts pitch, duration and data', function () {
      assert.deepEqual(score.note(3, 'A', { inst: 'synth' }),
      { pitch: 'A', duration: 3, inst: 'synth' })
    })
  })

  describe('sequential', function () {
    var qn = score.note(1)
    it('from array', function () {
      assert.deepEqual(score.seq([qn('A'), qn('B')]), ['seq',
      { pitch: 'A', duration: 1 },
      { pitch: 'B', duration: 1 } ])
    })
    it('from arguments', function () {
      assert.deepEqual(score.seq(qn('A'), qn('B')),
        score.seq([qn('A'), qn('B')]))
    })
    it('joins seq sim', function () {
      assert.deepEqual(score.seq(score.sim(qn('A'))),
        [ 'seq', [ 'sim', { pitch: 'A', duration: 1 } ] ])
    })
  })
  describe('simultaneous', function () {
    var qn = score.note(1)
    it('from array', function () {
      assert.deepEqual(score.sim([qn('A'), qn('B')]), ['sim',
        { pitch: 'A', duration: 1 },
        { pitch: 'B', duration: 1 } ])
    })
    it('from arguments', function () {
      assert.deepEqual(score.sim(qn('A'), qn('B')),
        score.sim([qn('A'), qn('B')]))
    })
    it('joins sim seq', function () {
      assert.deepEqual(score.sim(score.seq(qn('A'))),
        ['sim', ['seq', { duration: 1, pitch: 'A' }]])
    })
  })

  describe('transform function', function () {
    var T = score.transform(
      function (note) { return note.pitch },
      function (seq) { return '(' + seq.join(',') + ')' },
      function (par) { return '[' + par.join('+') + ']' },
      null
    )
    it('can transform notes', function () {
      assert.deepEqual(T(score.note(1, 'A')), 'A')
    })
    it('can transform sequences', function () {
      assert.deepEqual(T(score.phrase('A B C')), '(A,B,C)')
    })
    it('can transform sim', function () {
      assert.deepEqual(T(score.chord('A B C')), '[A+B+C]')
    })
    it('can transform musical structures', function () {
      assert.deepEqual(T(score.sim(
        score.phrase('A B C'), score.seq(score.chord('C E G'), score.chord('D F A'))
      )), '[(A,B,C)+([C+E+G],[D+F+A])]')
    })
  })

  describe('map function', function () {
    it('can map notes', function () {
      var piano = score.map(function (note) {
        return score.el(note, { inst: 'piano' })
      }, null)
      assert.deepEqual(piano(score.seq(score.chord('A B'), score.chord('B C'))), ['seq',
        ['sim', { pitch: 'A', duration: 1, inst: 'piano' },
        { pitch: 'B', duration: 1, inst: 'piano' }],
        ['sim', { pitch: 'B', duration: 1, inst: 'piano' },
        { pitch: 'C', duration: 1, inst: 'piano' }] ])
    })
    it('passes a context object', function () {
      var inst = score.map(function (note, name) {
        return score.el(note, { inst: name })
      })
      assert.deepEqual(inst('piano', score.seq(score.chord('A B'), score.chord('B C'))), ['seq',
        ['sim', { pitch: 'A', duration: 1, inst: 'piano' },
        { pitch: 'B', duration: 1, inst: 'piano' }],
        ['sim', { pitch: 'B', duration: 1, inst: 'piano' },
        { pitch: 'C', duration: 1, inst: 'piano' }] ])
    })
  })
})
