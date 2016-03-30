/* global describe it */

var assert = require('assert')
var score = require('..')

describe('Harmony module', function () {
  describe('chords function', function () {
    it('chords', function () {
      assert.deepEqual(score.chords('4/4', 'C | Dm G7 | C'), [ 'seq',
        { duration: 4, chord: 'C' },
        { duration: 2, chord: 'Dm' },
        { duration: 2, chord: 'G7' },
        { duration: 4, chord: 'C' } ])
    })
  })

  describe('harmony function', function () {
    it('expands harmony from a score', function () {
      assert.deepEqual(score.expandChords(['seq', {chord: 'Cmaj7'}, {chord: 'G 7'}]),
        ['seq',
          ['sim', { pitch: 'C4', duration: 1 }, { pitch: 'E4', duration: 1 },
            { pitch: 'G4', duration: 1 }, { pitch: 'B4', duration: 1 }],
          ['sim', { pitch: 'G4', duration: 1 }, { pitch: 'B4', duration: 1 },
            { pitch: 'D4', duration: 1 }, { pitch: 'F4', duration: 1 }]
        ])
    })

    it('creates harmony from measures', function () {
      assert.deepEqual(score.harmony('4/4', 'C | Dm G'),
        score.seq(
          score.chord('C4 E4 G4', 4),
          score.chord('D4 F4 A4', 2),
          score.chord('G4 B4 D4', 2)
        ))
    })
  })
})
