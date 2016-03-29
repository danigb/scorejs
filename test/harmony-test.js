/* global describe it */

var assert = require('assert')
var harmony = require('../lib/harmony')

describe('Harmony module', function () {
  describe('chords function', function () {
    it('chords', function () {
      assert.deepEqual(harmony.chords('4/4', 'C | Dm G7 | C'), [ 'seq',
        { duration: 4, chord: 'C' },
        { duration: 2, chord: 'Dm' },
        { duration: 2, chord: 'G7' },
        { duration: 4, chord: 'C' } ])
    })
  })

  describe('harmony function', function () {
    it('expands harmony from a score', function () {
      assert.deepEqual(harmony.harmony(['seq', {chord: 'Cmaj7'}, {chord: 'G 7'}]),
        ['seq',
          ['sim', { pitch: 'C', duration: 1 }, { pitch: 'E', duration: 1 },
            { pitch: 'G', duration: 1 }, { pitch: 'B', duration: 1 }],
          ['sim', { pitch: 'G', duration: 1 }, { pitch: 'B', duration: 1 },
            { pitch: 'D', duration: 1 }, { pitch: 'F', duration: 1 }]
        ])
    })
  })
})
