var vows = require('vows')
var assert = require('assert')
var _ = require('lodash')

var Score = require('../')
Score.use(require('../ext/builder.js'))

vows.describe('Score builder').addBatch({
  'builder without transformation': function () {
    var s = Score.build({
      melody: 'e b |',
      chords: 'C G |'
    })
    assert.deepEqual(_.pluck(s.sequence, 'value'), ['e', 'C', 'b', 'G'])
    assert.deepEqual(_.pluck(s.sequence, 'position'), [0, 0, 0.5, 0.5])
    assert.deepEqual(_.pluck(s.sequence, 'duration'), [0.5, 0.5, 0.5, 0.5])
  },
  'builder with parts': function() {
    var s = Score.build({
      title: 'The Title',
      time: '2/4',
      parts: {
        melody: {
          score: 'e b |',
          transpose: 'M2'
        },
        chords: 'C G |'
      }
    })
    assert.equal(s.title, 'The Title')
    assert.equal(s.time, '2/4')
    assert.deepEqual(_.pluck(s.parts['melody'].sequence, 'value'), ['f#2', 'c#3'])
  },
  'builder with transformation': function () {
    var s = Score.build({
      melody: {
        score: 'e b |',
        transpose: 'M2'
      },
      chords: {
        score: 'C G |'
      }
    })
    assert.deepEqual(_.pluck(s.sequence, 'value'), ['f#2', 'C', 'c#3', 'G'])
    assert.deepEqual(_.pluck(s.sequence, 'position'), [0, 0, 0.5, 0.5])
    assert.deepEqual(_.pluck(s.sequence, 'duration'), [0.5, 0.5, 0.5, 0.5])
  }
}).export(module)
