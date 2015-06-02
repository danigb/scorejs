var vows = require('vows')
var assert = require('assert')
var _ = require('lodash')

var Score = require('../')

var integrations = ['AnthropologyParker.ls.json']

var integrationTests = integrations.reduce(function (tests, name) {
  tests[name] = function () {
    var data = require('./integration/' + name)
    var score = Score.build(data)
    var duration = score.parts.chords.duration()
    for (var partName in score.parts) {
      assert.equal(score.parts[partName].duration(), duration)
    }
  }
  return tests
}, {})

vows.describe('Score builder').addBatch(integrationTests).addBatch({
  'builder with parts': function () {
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
  }
}).export(module)
