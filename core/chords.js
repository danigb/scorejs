'use strict'

var Note = require('note-pitch')
var daccord = require('daccord')

module.exports = function (Score) {
  Score.fn.chords = function () {
    return Score(this, function (event) {
      var chord = parseChord(event.value)
      if (chord) {
        return Score.event(event, { chord: chord })
      }
    })
  }

  Score.fn.playChords = function () {
    return Score(this.chords(), function (event) {
      var chord = event.chord
      if (chord) {
        var notes = Note.transpose(chord.root, chord.intervals)
        return notes.map(function (note) {
          return Score.event(event, { value: note })
        })
      }
    })
  }
}

function parseChord (value) {
  var chord = {}
  chord.root = Note.parse(value[0])
  chord.type = value.substring(1)
  chord.intervals = daccord(chord.type)
  return (chord.root && chord.intervals) ? chord : null
}
