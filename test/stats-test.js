/* global describe it */

var assert = require('assert')
var score = require('..')

describe('[stats]', function () {
  it('get note duration', function () {
    assert.equal(score.duration(score.phrase('a b c', 1)), 3)
    assert.equal(score.duration(score.chord('a b c', 1)), 1)
  })
  it('can get longest note duration', function () {
    assert.equal(score.longest(score.phrase('a b c', '1 2 1')), 2)
  })
  it('can get the number of elements', function () {
    assert.equal(score.count(score.phrase('a b c')), 3)
  })
})
