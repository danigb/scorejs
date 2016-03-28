/* global describe it */

var assert = require('assert')
var score = require('..')

describe('Score builder', function () {
  it('create notes', function () {
    assert.deepEqual(score(['note', 'C', 2]),
      { duration: 2, pitch: 'C' })
  })
  it('create sequences', function () {
    assert.deepEqual(score(['seq', ['note', 'C', 2]]),
      ['seq', { duration: 2, pitch: 'C' }])
  })
  it('create parallel', function () {
    assert.deepEqual(score(['par', ['note', 'C', 2]]),
      ['par', { duration: 2, pitch: 'C' }])
  })
  it('create phrases', function () {
    assert.deepEqual(score(['phrase', 'C D E', '3 2 1']), ['seq',
      { duration: 3, pitch: 'C' },
      { duration: 2, pitch: 'D' },
      { duration: 1, pitch: 'E' }])
  })
  it('create chords', function () {
    assert.deepEqual(score(['chord', 'C D E', '3 2 1']), ['par',
      { duration: 3, pitch: 'C' },
      { duration: 2, pitch: 'D' },
      { duration: 1, pitch: 'E' }])
  })
  it.skip('create complex score', function () {
    score(['tempo', 120, ['parts',
      ['oct', '2', ['phrase', 'C D E']],
      ['phrase', 'F G E'],
      ['harmony', ['measures', '4/4', 'CM7 | % | Dm7 G7 | Am7']]
    ]])
  })
})
