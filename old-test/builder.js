var vows = require('vows')
var assert = require('assert')
var readFile = require('fs').readFileSync
var _ = require('lodash')

var Score = require('../')

vows.describe('Score builder').addBatch({
  'test custom txt format': function () {
    var data = readFile('./test/integration/TestFormat.scorejs.txt', 'utf8')
    var score = Score.build(data)
    assert.equal(score.title, 'Values are left and right trimmed')
    assert.equal(score.author, 'Keys are trimmed too')
    assert.equal(score.quotes, 'Double quotes are ignored')
    assert.equal(score.singleQuotes, 'Single quotes are ignored')
    assert.deepEqual(_.pluck(score.part('partA').sequence, 'value'), ['A', 'B'])
    assert.deepEqual(_.pluck(score.part('partB').sequence, 'value'), ['a', 'b', 'c', 'd'])
    assert.equal(score.part('partA').duration(), score.part('partB').duration())
  },
  'builder with custom txt format': function () {
    var data = readFile('./test/integration/GoodByePorkPieHat.scorejs.txt', 'utf8')
    var score = Score.build(data)
    assert.equal(score.title, 'Good Bye Pork Pie Hat')
    assert.equal(score.author, 'Charles Mingus')
    assert.equal(score.meter, '4/4')
    assert.equal(score.key, '-4')
    assert.equal(score.part('chords').duration(), 14)
    assert.equal(score.part('melody').duration(), 14)
  },
  'builder with json string': function () {
    var data = readFile('./test/integration/AnthropologyParker.ls.json', 'utf8')
    var score = Score.build(data)
    assert.equal(score.title, 'Anthropology')
    assert.equal(score.meter, '4/4')
    assert.equal(score.part('chords').duration(), 32)
    assert.equal(score.part('Chorus 1').duration(), 32)
  },
  'builder with object': function () {
    var s = Score.build({
      title: 'The Title',
      meter: '2/4',
      parts: {
        melody: {
          score: 'e b |',
          transpose: 'M2'
        },
        chords: 'C G |'
      }
    })
    assert.equal(s.title, 'The Title')
    assert.equal(s.meter, '2/4')
    assert.deepEqual(_.pluck(s.parts['melody'].sequence, 'value'), ['f#4', 'c#5'])
  }
}).export(module)
