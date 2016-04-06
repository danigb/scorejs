/* global describe it */

var assert = require('assert')
var score = require('..')
var qn = score.note(1)

describe('Builder module', function () {
  describe('build function', function () {
    it('create elements', function () {
      assert.deepEqual(score(['seq', ['note', 1, 'C']]),
        score.seq(qn('C')))
    })
    it('create simultaneosly if more than one parameter', function () {
      assert.deepEqual(score(['note', 1, 'A'], ['note', 1, 'B']),
        score.sim(qn('A'), qn('B')))
    })
    it('accepts functions', function () {
      var piano = score.map(function (e) { return score.el(e, { inst: 'piano' }) }, null)
      assert.deepEqual(score([piano, ['note', 1, 'A']]),
        { pitch: 'A', duration: 1, inst: 'piano' })
    })
    it('can create variables with $', function () {
      assert.deepEqual(score(['$v', ['note', 1, 'A']], ['seq', '$v', '$v']),
        ['sim', ['seq', {pitch: 'A', duration: 1}, {pitch: 'A', duration: 1}]])
    })
    it('accepts its own output', function () {
      var s = ['seq',
        ['sim', { pitch: 'C4', duration: 1 }, { pitch: 'E4', duration: 1 },
          { pitch: 'G4', duration: 1 }, { pitch: 'B4', duration: 1 }],
        ['sim', { pitch: 'G4', duration: 1 }, { pitch: 'B4', duration: 1 },
          { pitch: 'D4', duration: 1 }, { pitch: 'F4', duration: 1 }]
      ]
      assert.deepEqual(score(s), s)
    })
  })
  describe('build integration', function () {
    it('create notes', function () {
      assert.deepEqual(score(['note', 2, 'C']), score.note(2, 'C'))
    })
    it('create sequences', function () {
      assert.deepEqual(score(['seq', ['note', 2, 'C']]),
        score.seq(score.note(2, 'C')))
    })
    it('create simultaneous', function () {
      assert.deepEqual(score(['sim', ['note', 2, 'C']]),
        score.sim(score.note(2, 'C')))
    })
    it('create phrases', function () {
      assert.deepEqual(score(['phrase', 'C D E', '3 2 1']), ['seq',
        { duration: 3, pitch: 'C' },
        { duration: 2, pitch: 'D' },
        { duration: 1, pitch: 'E' }])
    })
    it('create chords', function () {
      assert.deepEqual(score(['chord', 'C D E', '3 2 1']), ['sim',
        { duration: 3, pitch: 'C' },
        { duration: 2, pitch: 'D' },
        { duration: 1, pitch: 'E' }])
    })
  })
  it.skip('create complex score', function () {
    score(['tempo', 120, ['parts',
      ['oct', '2', ['phrase', 'C D E']],
      ['phrase', 'F G E'],
      ['harmony', ['measures', '4/4', 'CM7 | % | Dm7 G7 | Am7']]
    ]])
  })
})
