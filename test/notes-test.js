/* global describe it */

var assert = require('assert')
var _ = require('..')

describe('Notes module', function () {
  it('can create phrases', function () {
    assert.deepEqual(_.phrase('A B C D', '1 0.5'), [ 'seq',
        { pitch: 'A', duration: 1 },
        { pitch: 'B', duration: 0.5 },
        { pitch: 'C', duration: 1 },
        { pitch: 'D', duration: 0.5 } ])
  })
  it('can create chords', function () {
    assert.deepEqual(_.chord('C E G'), [ 'par',
    { pitch: 'C', duration: 1 },
    { pitch: 'E', duration: 1 },
    { pitch: 'G', duration: 1 } ])
  })
})
