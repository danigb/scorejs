/* global describe it */
var assert = require('assert')
var ScoreJS = require('../lib/index')
var Event = ScoreJS.Event
var Seq = ScoreJS.Seq

describe('Event', function () {
  it('create notes', function () {
    assert.deepEqual(Event.Note('C2'), [ 0, 1, 'note', 'C2', 100 ])
    assert.equal(Event.Note('blah'))
  })
})

describe('Sequence', function () {
  it('concat events', function () {
    assert.deepEqual(Seq(null, ['c', 'd', 'eb'].map(Event.Note)).events,
    [ [ 0, 1, 'note', 'C', 100 ],
    [ 1, 1, 'note', 'D', 100 ],
    [ 2, 1, 'note', 'Eb', 100 ] ])
  })
})
